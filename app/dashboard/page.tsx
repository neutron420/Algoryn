import { CompanyProblemGrid } from "@/components/company-problem-grid";
import { findCompanyBySlug, findProblemsForCompany } from "@/lib/repositories/company.repository";
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import { ProblemItem } from "@/types/problem";
import { TargetCompaniesBar } from "@/components/target-companies-bar";
import { getOrSetCache } from "@/lib/redis";

interface PageProps {
  searchParams: Promise<{
    company?: string;
  }>;
}

interface RawTopicItem {
  topic: { name: string };
}

interface RawCompanyItem {
  company: { name: string; slug: string };
}

interface RawProblemEntry {
  timeframe?: string | null;
  problem: {
    id: number;
    leetcodeNumber?: number | null;
    title: string;
    slug: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    leetcodeUrl: string;
    topics: RawTopicItem[];
    companies?: RawCompanyItem[];
  };
}

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: PageProps) {
  const { company: selectedSlugParam } = await searchParams;

  // 1. Fetch all companies for sidebar & quick switch (cached for 24h)
  const sidebarCompanies = await getOrSetCache(
    "cache:companies:sidebar",
    async () => {
      let allCompaniesRaw: {
        id: number;
        name: string;
        slug: string;
        _count: { problems: number; communityProblems?: number };
      }[] = [];
      try {
        allCompaniesRaw = await withDbRetry(() =>
          prisma.company.findMany({
            select: {
              id: true,
              name: true,
              slug: true,
              _count: { select: { problems: true, communityProblems: true } },
            },
            orderBy: { problems: { _count: "desc" } },
          })
        );
      } catch (err) {
        console.warn("Failed to fetch sidebar companies in dashboard:", err);
      }

      return allCompaniesRaw.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        problemCount: (c._count.problems ?? 0) + (c._count.communityProblems ?? 0),
      }));
    },
    86400 // 24 hours TTL
  );

  // Determine active company slug (default to "google" or first available company)
  const activeSlug = selectedSlugParam || sidebarCompanies[0]?.slug || "google";

  // 2. Fetch active company metadata (cached for 24h)
  let activeCompany = await getOrSetCache(
    `cache:company:${activeSlug}:meta`,
    async () => {
      try {
        return await findCompanyBySlug(activeSlug);
      } catch (err) {
        console.warn("Failed to fetch active company by slug:", err);
        return null;
      }
    },
    86400
  );

  if (!activeCompany) {
    // Fallback if DB lookup missed
    activeCompany = {
      id: 1,
      name: activeSlug.charAt(0).toUpperCase() + activeSlug.slice(1),
      slug: activeSlug,
      _count: { problems: 0, communityProblems: 0 },
    };
  }

  // 3. Fetch standard problems & crowdsourced community problems for active company (cached for 2 hours)
  const problems = await getOrSetCache<ProblemItem[]>(
    `cache:company:${activeCompany.slug}:problems`,
    async () => {
      let rawProblems: RawProblemEntry[] = [];
      let communityProblemsRaw: Array<{
        id: number;
        title: string;
        difficulty: "EASY" | "MEDIUM" | "HARD";
        problemUrl: string | null;
        topics: string[];
        platform: import("@/types/problem").CodingPlatformType;
        roundType: string;
        interviewMonth?: string | null;
        interviewYear?: number | null;
        timeframe?: string | null;
        notes: string | null;
        upvotes: number;
        company?: { name: string; slug: string };
        user?: { displayName: string | null; photoUrl: string | null; email?: string | null } | null;
      }> = [];

      try {
        const [fetchedProblems, fetchedCommunity] = await Promise.all([
          findProblemsForCompany(activeCompany.id, {
            page: 1,
            limit: 1000,
            sort: "title",
            order: "asc",
          }),
          withDbRetry(() =>
            prisma.communityProblem.findMany({
              where: { companyId: activeCompany.id },
              orderBy: [{ upvotes: "desc" }, { createdAt: "desc" }],
              include: {
                company: { select: { name: true, slug: true } },
                user: { select: { displayName: true, photoUrl: true, email: true } },
              },
            })
          ),
        ]);
        rawProblems = fetchedProblems as unknown as RawProblemEntry[];
        communityProblemsRaw = fetchedCommunity as typeof communityProblemsRaw;
      } catch (err) {
        console.warn("Failed to fetch problems for company in dashboard:", err);
      }

      // Find other companies that also had the same community questions reported
      const titleToOtherCompaniesMap = new Map<string, Array<{ name: string; slug: string }>>();
      if (communityProblemsRaw.length > 0) {
        try {
          const titles = communityProblemsRaw.map((c) => c.title.toLowerCase().trim());
          const otherMatches = await withDbRetry(() =>
            prisma.communityProblem.findMany({
              where: {
                title: { in: titles, mode: "insensitive" },
              },
              select: {
                title: true,
                company: { select: { name: true, slug: true } },
              },
            })
          );
          for (const m of otherMatches) {
            if (!m.company) continue;
            const key = m.title.toLowerCase().trim();
            const list = titleToOtherCompaniesMap.get(key) || [];
            if (!list.some((existing) => existing.slug === m.company.slug)) {
              list.push(m.company);
            }
            titleToOtherCompaniesMap.set(key, list);
          }
        } catch (e) {
          console.warn("Failed to fetch cross-company community matches:", e);
        }
      }

      const standardProblems: ProblemItem[] = rawProblems.map((rp) => ({
        id: rp.problem.id,
        leetcodeNumber: rp.problem.leetcodeNumber,
        title: rp.problem.title,
        slug: rp.problem.slug,
        difficulty: rp.problem.difficulty,
        leetcodeUrl: rp.problem.leetcodeUrl,
        topics: rp.problem.topics.map((t) => t.topic.name),
        timeframe: rp.timeframe || "ALL",
        companiesAsking: rp.problem.companies
          ? rp.problem.companies.map((c) => ({
              name: c.company.name,
              slug: c.company.slug,
            }))
          : [],
        platform: "LEETCODE",
        isCommunity: false,
      }));

      const communityProblems: ProblemItem[] = communityProblemsRaw.map((cp) => {
        const key = cp.title.toLowerCase().trim();
        const otherCompanies = titleToOtherCompaniesMap.get(key) || [];
        const currentSlug = cp.company?.slug || activeCompany.slug;
        const currentName = cp.company?.name || activeCompany.name;

        const companiesAskingList = [
          { name: currentName, slug: currentSlug },
          ...otherCompanies.filter((c) => c.slug !== currentSlug),
        ];

        const interviewDate =
          cp.interviewMonth && cp.interviewYear
            ? `${cp.interviewMonth} ${cp.interviewYear}`
            : cp.interviewMonth || (cp.interviewYear ? String(cp.interviewYear) : null);

        return {
          id: cp.id + 1_000_000, // Distinct key range to prevent collision with standard problem IDs
          title: cp.title,
          slug: `community-${cp.id}`,
          difficulty: cp.difficulty,
          leetcodeUrl: cp.problemUrl || "#",
          topics: Array.isArray(cp.topics) ? cp.topics : [],
          companiesAsking: companiesAskingList,
          platform: cp.platform,
          isCommunity: true,
          roundType: cp.roundType,
          timeframe: cp.timeframe || "ALL",
          interviewMonth: cp.interviewMonth,
          interviewYear: cp.interviewYear,
          interviewDate,
          notes: cp.notes,
          upvotes: cp.upvotes,
          submittedBy: cp.user
            ? {
                displayName:
                  cp.user.displayName ||
                  (cp.user.email ? cp.user.email.split("@")[0] : "Community Member"),
                photoUrl: cp.user.photoUrl,
              }
            : null,
        };
      });

      // Combined problems: Community-reported interview questions first, then standard list
      return [...communityProblems, ...standardProblems];
    },
    7200 // 2 hours TTL
  );

  return (
    <div className="flex-1 p-2.5 sm:p-5 lg:p-8 w-full max-w-full transition-all duration-300 space-y-3.5 sm:space-y-4">
      {/* Target Companies Quick-Switch Ribbon */}
      <TargetCompaniesBar
        companies={sidebarCompanies}
        activeCompanySlug={activeCompany.slug}
      />

      <CompanyProblemGrid
        problems={problems}
        companyName={activeCompany.name}
        companySlug={activeCompany.slug}
      />
    </div>
  );
}
