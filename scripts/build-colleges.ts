import fs from "fs";
import path from "path";
import { INDIAN_COLLEGES } from "../lib/profile-constants";

function parseCsvLine(text: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === "," && !inQuotes) {
      result.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

function toTitleCase(str: string): string {
  if (!str) return "";
  return str.toLowerCase().replace(/(^|\s|\/|\(|\))\b([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
}

async function run() {
  console.log("Starting massive Indian colleges dataset compilation...");
  
  const seen = new Set<string>();
  const colleges: string[] = [];

  // 1. First add curated premier colleges (highest priority for search ranking)
  for (const c of INDIAN_COLLEGES) {
    const key = c.trim().toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      colleges.push(c.trim());
    }
  }
  console.log(`Step 1: Added ${colleges.length} curated premier institutions`);

  // 2. Fetch & parse AISHE dataset (All India Survey on Higher Education)
  try {
    console.log("Step 2: Fetching AISHE colleges dataset (38,378 rows)...");
    const csvRes = await fetch("https://raw.githubusercontent.com/JacobSamro/colleges-api/master/db/database.csv");
    if (csvRes.ok) {
      const csvText = await csvRes.text();
      const lines = csvText.split("\n");
      // Format: S. No.,University Name,College Name,College Type,State Name,District Name
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = parseCsvLine(line);
        if (cols.length < 5) continue;

        let collegeName = cols[2].replace(/"/g, "").replace(/\(Id:[^)]+\)/i, "").trim();
        let stateName = cols[cols.length - 2]?.replace(/"/g, "").trim() || "";
        let distName = cols[cols.length - 1]?.replace(/"/g, "").trim() || "";

        if (!collegeName || collegeName.length < 3) continue;

        let formatted = collegeName;
        if (distName && !formatted.toLowerCase().includes(distName.toLowerCase())) {
          formatted += `, ${distName}`;
        }
        if (stateName && !formatted.toLowerCase().includes(stateName.toLowerCase())) {
          formatted += ` (${stateName})`;
        }

        const key = formatted.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          colleges.push(formatted);
        }
      }
      console.log(`Total after AISHE: ${colleges.length} colleges`);
    }
  } catch (err) {
    console.warn("AISHE fetch warning:", err);
  }

  // 3. Fetch & parse AICTE technical institutions dataset (39,268 records)
  try {
    console.log("Step 3: Fetching AICTE technical colleges dataset (39,268 rows)...");
    const aicteRes = await fetch("https://raw.githubusercontent.com/anburocky3/indian-colleges-data/main/data/institutions.json");
    if (aicteRes.ok) {
      const aicte = await aicteRes.json();
      for (const item of aicte) {
        if (!item.institute_name) continue;
        const name = toTitleCase(item.institute_name.trim());
        const dist = item.district ? toTitleCase(item.district.trim()) : "";
        const entry = dist && !name.toLowerCase().includes(dist.toLowerCase()) ? `${name}, ${dist}` : name;
        const key = entry.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          colleges.push(entry);
        }
      }
      console.log(`Total after AICTE: ${colleges.length} colleges`);
    }
  } catch (err) {
    console.warn("AICTE fetch warning:", err);
  }

  // 4. Save to data/all-indian-colleges.json
  const outDir = path.resolve("./data");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outFile = path.join(outDir, "all-indian-colleges.json");
  fs.writeFileSync(outFile, JSON.stringify(colleges));
  const stats = fs.statSync(outFile);
  console.log(`\nSUCCESS: Saved ${colleges.length} all-India colleges to data/all-indian-colleges.json (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
}

run().catch(console.error);
