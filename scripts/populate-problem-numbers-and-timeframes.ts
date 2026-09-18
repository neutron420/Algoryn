import "dotenv/config";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { parseCsvFile } from "./lib/csv";
import { chunk, normalizeProblemUrl, slugifyCompanyName } from "./lib/normalize";
import { prisma, disconnect } from "./lib/prisma";

const ALIASES: Record<string, string> = {
  "cruise-automation": "cruise",
  "jtg": "josh-technology",
  "kla-tencor": "kla",
  "larsen-toubro": "larsen-and-toubro",
  "lendingkart": "lendingkart-technologies",
  "lowe": "lowes",
  "national-payments-coorperation-india": "national-payments-corporation-of-india",
  "ola": "ola-cabs",
  "pure": "pure-storage",
  "ramp": "ramp-finance",
  "ramp-2": "ramp-finance",
  "reliance-retails": "reliance-retail",
  "snapchat": "snap",
  "square": "block",
  "tower-research": "tower-research-capital",
  "tripactions": "navan",
  "twitter": "x",
  "veeva": "veeva-systems",
  "virtu": "virtu-financial",
  "wissen": "wissen-technology",
};

const TIMEFRAME_PRIORITY: Record<string, number> = {
  THIRTY_DAYS: 1,
  THREE_MONTHS: 2,
  SIX_MONTHS: 3,
  MORE_THAN_SIX_MONTHS: 4,
  ALL: 5,
};

function getTimeframeFromFilename(filename: string): string | null {
  const lower = filename.toLowerCase();
  if (lower.includes("thirty") || lower.includes("30-day") || lower.includes("30_day") || lower.includes("thirty-days")) {
    return "THIRTY_DAYS";
  }
  if (lower.includes("three-month") || lower.includes("3-month") || lower.includes("three_months") || lower.includes("three months")) {
    return "THREE_MONTHS";
  }
  if (lower.includes("six-month") || lower.includes("6-month") || lower.includes("six_months") || lower.includes("six months")) {
    return "SIX_MONTHS";
  }
  if (lower.includes("more-than-six") || lower.includes("more than six") || lower.includes("more_than_six")) {
    return "MORE_THAN_SIX_MONTHS";
  }
  if (lower.includes("all")) {
    return "ALL";
  }
  return null;
}

async function main(): Promise<void> {
  console.log("=== POPULATING LEETCODE NUMBERS & TIMEFRAMES ===");

  // 1. Collect slug -> LeetCode number mappings
  const slugToNumber = new Map<string, number>();

  // A. From snehasishroy
  console.log("Extracting problem numbers from data/snehasishroy...");
  const snhBase = "data/snehasishroy";
  const snhDirs = readdirSync(snhBase).filter(
    (d) => d !== ".git" && d !== "src" && statSync(join(snhBase, d)).isDirectory()
  );

  for (const dir of snhDirs) {
    const dirPath = join(snhBase, dir);
    const files = readdirSync(dirPath).filter((f) => f.toLowerCase().endsWith(".csv"));
    for (const f of files) {
      const { records } = parseCsvFile(join(dirPath, f));
      for (const { record } of records) {
        const rawUrl = record["URL"] || record["Link"] || record["url"] || record["link"];
        const normUrl = normalizeProblemUrl(rawUrl);
        if (!normUrl) continue;

        const rawId = record["ID"] || record["Id"] || record["id"];
        if (rawId) {
          const num = parseInt(rawId.trim(), 10);
          if (!isNaN(num) && num > 0) {
            slugToNumber.set(normUrl.slug, num);
          }
        }
      }
    }
  }

  // B. From farneetsingh problem_data.csv (backup)
  try {
    const farneetCsv = "data/farneetsingh/problem_data.csv";
    const { records } = parseCsvFile(farneetCsv);
    for (const { record } of records) {
      const rawId = record["Problem ID"];
      const rawName = record["Problem Name"];
      if (rawId && rawName) {
        const num = parseInt(rawId.trim(), 10);
        const slug = slugifyCompanyName(rawName);
        if (!isNaN(num) && num > 0 && !slugToNumber.has(slug)) {
          slugToNumber.set(slug, num);
        }
      }
    }
  } catch {
    // optional
  }

  console.log(`Found ${slugToNumber.size} problem slug -> number mappings.`);

  // 2. Update Problem.leetcodeNumber in Database
  const dbProblems = await prisma.problem.findMany({ select: { id: true, slug: true } });
  const problemUpdates: { id: number; leetcodeNumber: number }[] = [];

  for (const p of dbProblems) {
    const num = slugToNumber.get(p.slug);
    if (num) {
      problemUpdates.push({ id: p.id, leetcodeNumber: num });
    }
  }

  console.log(`Updating ${problemUpdates.length} problems with LeetCode numbers...`);

  // Execute in parallel batches using raw SQL for maximum speed
  for (const batch of chunk(problemUpdates, 500)) {
    const values = batch.map((u) => `(${u.id}, ${u.leetcodeNumber})`).join(", ");
    await prisma.$executeRawUnsafe(`
      UPDATE "Problem" AS p
      SET "leetcodeNumber" = v.num
      FROM (VALUES ${values}) AS v(id, num)
      WHERE p.id = v.id;
    `);
  }

  console.log("LeetCode numbers updated successfully.");

  // 3. Scan and collect Timeframe data for CompanyProblem
  console.log("Scanning timeframe files across company folders...");
  const dbCompanies = await prisma.company.findMany({ select: { id: true, slug: true } });
  const companyBySlug = new Map<string, number>();
  const companyByClean = new Map<string, number>();
  for (const c of dbCompanies) {
    companyBySlug.set(c.slug, c.id);
    companyByClean.set(c.slug.replace(/[^a-z0-9]/g, ""), c.id);
  }

  const dbProblemIdBySlug = new Map<string, number>();
  for (const p of dbProblems) {
    dbProblemIdBySlug.set(p.slug, p.id);
  }

  // Map: `${companyId}:${problemId}` -> best (lowest priority number) timeframe
  const pairTimeframeMap = new Map<string, string>();

  function processCompanyDir(dirName: string, fullPath: string) {
    const targetSlug = ALIASES[dirName] ?? slugifyCompanyName(dirName);
    const companyId = companyBySlug.get(targetSlug) ?? companyByClean.get(dirName.toLowerCase().replace(/[^a-z0-9]/g, ""));
    if (!companyId) return;

    let files: string[] = [];
    try {
      files = readdirSync(fullPath).filter((f) => f.toLowerCase().endsWith(".csv"));
    } catch {
      return;
    }

    for (const f of files) {
      const timeframe = getTimeframeFromFilename(f);
      if (!timeframe) continue;

      const { records } = parseCsvFile(join(fullPath, f));
      for (const { record } of records) {
        const rawUrl = record["URL"] || record["Link"] || record["url"] || record["link"];
        const normUrl = normalizeProblemUrl(rawUrl);
        if (!normUrl) continue;

        const problemId = dbProblemIdBySlug.get(normUrl.slug);
        if (!problemId) continue;

        const key = `${companyId}:${problemId}`;
        const existing = pairTimeframeMap.get(key);
        if (!existing) {
          pairTimeframeMap.set(key, timeframe);
        } else {
          // Keep the most recent (lower priority number)
          if (TIMEFRAME_PRIORITY[timeframe] < TIMEFRAME_PRIORITY[existing]) {
            pairTimeframeMap.set(key, timeframe);
          }
        }
      }
    }
  }

  // Scan leetcode-company-wise-problems
  const lcwBase = "data/leetcode-company-wise-problems";
  const lcwDirs = readdirSync(lcwBase).filter(
    (d) => d !== ".git" && statSync(join(lcwBase, d)).isDirectory()
  );
  for (const dir of lcwDirs) {
    processCompanyDir(dir, join(lcwBase, dir));
  }

  // Scan snehasishroy
  for (const dir of snhDirs) {
    processCompanyDir(dir, join(snhBase, dir));
  }

  console.log(`Found ${pairTimeframeMap.size} company-problem timeframe classifications.`);

  // 4. Update CompanyProblem.timeframe in batches
  const timeframeUpdates: { companyId: number; problemId: number; timeframe: string }[] = [];
  for (const [key, timeframe] of pairTimeframeMap) {
    const [cId, pId] = key.split(":").map(Number);
    timeframeUpdates.push({ companyId: cId, problemId: pId, timeframe });
  }

  console.log("Updating CompanyProblem timeframes in database...");
  for (const batch of chunk(timeframeUpdates, 1000)) {
    const values = batch
      .map((u) => `(${u.companyId}, ${u.problemId}, '${u.timeframe}')`)
      .join(", ");
    await prisma.$executeRawUnsafe(`
      UPDATE "CompanyProblem" AS cp
      SET "timeframe" = v.tf
      FROM (VALUES ${values}) AS v(cid, pid, tf)
      WHERE cp."companyId" = v.cid AND cp."problemId" = v.pid;
    `);
  }

  // Check stats
  const [thirtyDays, threeMonths, sixMonths, moreSix, all] = await Promise.all([
    prisma.companyProblem.count({ where: { timeframe: "THIRTY_DAYS" } }),
    prisma.companyProblem.count({ where: { timeframe: "THREE_MONTHS" } }),
    prisma.companyProblem.count({ where: { timeframe: "SIX_MONTHS" } }),
    prisma.companyProblem.count({ where: { timeframe: "MORE_THAN_SIX_MONTHS" } }),
    prisma.companyProblem.count({ where: { timeframe: "ALL" } }),
  ]);

  const numberedCount = await prisma.problem.count({ where: { leetcodeNumber: { not: null } } });

  console.log("");
  console.log("=== POPULATION SUMMARY ===");
  console.log(`Problems with numeric LeetCode numbers: ${numberedCount} / ${dbProblems.length}`);
  console.log(`Timeframe distribution in CompanyProblem:`);
  console.log(`  - THIRTY_DAYS        : ${thirtyDays}`);
  console.log(`  - THREE_MONTHS       : ${threeMonths}`);
  console.log(`  - SIX_MONTHS         : ${sixMonths}`);
  console.log(`  - MORE_THAN_SIX_MONTHS: ${moreSix}`);
  console.log(`  - ALL                : ${all}`);

  await disconnect();
}

main().catch(async (e) => {
  console.error("Population failed:", e);
  await disconnect();
  process.exit(1);
});
