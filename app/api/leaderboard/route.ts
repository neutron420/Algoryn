import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { getOrSetCache } from "@/lib/redis";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const platformParam = (searchParams.get("platform") || "ALL").toUpperCase();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(10, parseInt(searchParams.get("limit") || "50", 10)));
    const search = searchParams.get("search")?.trim() || "";
    const currentUserId = searchParams.get("userId") || undefined;

    const cacheKey = `cache:leaderboard:v1:${platformParam}:${page}:${limit}:${search || "all"}`;

    const data = await getOrSetCache(
      cacheKey,
      async () => {
        // Determine orderBy field based on selected platform
        let scoreField: keyof typeof prisma.leaderboardEntry.fields = "totalScore";
        let scoreFilter: Prisma.LeaderboardEntryWhereInput = {};

        switch (platformParam) {
          case "LEETCODE":
            scoreField = "leetcodeScore";
            scoreFilter = { leetcodeScore: { gt: 0 } };
            break;
          case "CODEFORCES":
            scoreField = "codeforcesScore";
            scoreFilter = { codeforcesScore: { gt: 0 } };
            break;
          case "CODECHEF":
            scoreField = "codechefScore";
            scoreFilter = { codechefScore: { gt: 0 } };
            break;
          case "GEEKSFORGEEKS":
            scoreField = "gfgScore";
            scoreFilter = { gfgScore: { gt: 0 } };
            break;
          case "ATCODER":
            scoreField = "atcoderScore";
            scoreFilter = { atcoderScore: { gt: 0 } };
            break;
          case "HACKERRANK":
            scoreField = "hackerrankScore";
            scoreFilter = { hackerrankScore: { gt: 0 } };
            break;
          default:
            scoreField = "totalScore";
            scoreFilter = { totalScore: { gt: 0 } };
            break;
        }

        const whereCondition: Prisma.LeaderboardEntryWhereInput = {
          ...scoreFilter,
        };

        if (search) {
          whereCondition.OR = [
            { displayName: { contains: search, mode: "insensitive" } },
            {
              user: {
                platformAccounts: {
                  some: { username: { contains: search, mode: "insensitive" } },
                },
              },
            },
          ];
        }

        const [totalCount, rows] = await Promise.all([
          prisma.leaderboardEntry.count({ where: whereCondition }),
          prisma.leaderboardEntry.findMany({
            where: whereCondition,
            orderBy: [{ [scoreField]: "desc" }, { totalScore: "desc" }, { updatedAt: "asc" }],
            skip: (page - 1) * limit,
            take: limit,
          }),
        ]);

        const userIds = rows.map((r) => r.userId);
        const platformAccounts = userIds.length > 0
          ? await prisma.userPlatformAccount.findMany({
              where: { userId: { in: userIds }, isVerified: true },
            })
          : [];

        const accountIds = platformAccounts.map((a) => a.id);
        const statsList = accountIds.length > 0
          ? await prisma.userPlatformStats.findMany({
              where: { accountId: { in: accountIds } },
              orderBy: { fetchedAt: "desc" },
            })
          : [];

        // Latest stat per accountId
        const latestStatByAccount = new Map<number, (typeof statsList)[0]>();
        for (const stat of statsList) {
          if (!latestStatByAccount.has(stat.accountId)) {
            latestStatByAccount.set(stat.accountId, stat);
          }
        }

        const accountsByUser = new Map<string, Array<{
          platform: (typeof platformAccounts)[0]["platform"];
          username: string;
          isVerified: boolean;
          stats: (typeof statsList)[0] | null;
        }>>();

        for (const acc of platformAccounts) {
          const list = accountsByUser.get(acc.userId) || [];
          list.push({
            platform: acc.platform,
            username: acc.username,
            isVerified: acc.isVerified,
            stats: latestStatByAccount.get(acc.id) || null,
          });
          accountsByUser.set(acc.userId, list);
        }

        const formattedEntries = rows.map((entry, index) => {
          const rank = (page - 1) * limit + index + 1;
          const platforms = accountsByUser.get(entry.userId) || [];

          return {
            id: entry.id,
            userId: entry.userId,
            displayName: entry.displayName || "Anonymous Coder",
            photoUrl: entry.photoUrl,
            rank,
            globalRank: entry.globalRank,
            totalScore: entry.totalScore,
            platformScores: {
              leetcode: entry.leetcodeScore,
              codeforces: entry.codeforcesScore,
              codechef: entry.codechefScore,
              atcoder: entry.atcoderScore,
              gfg: entry.gfgScore,
              hackerrank: entry.hackerrankScore,
              hackerearth: entry.hackerearthScore,
              interviewbit: entry.interviewbitScore,
            },
            activeScore:
              ((entry as unknown as Record<string, number>)[scoreField] as number) ||
              entry.totalScore,
            platforms,
            updatedAt: entry.updatedAt,
          };
        });

        // Top 3 Podium rankers for this filter
        const topThree = formattedEntries.slice(0, 3);

        return {
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          platform: platformParam,
          topThree,
          entries: formattedEntries,
        };
      },
      60 // 60s cache TTL
    );

    // Optional: Personal standing of the logged in user
    let userStanding = null;
    if (currentUserId) {
      const userEntry = await prisma.leaderboardEntry.findFirst({
        where: { userId: currentUserId },
      });

      if (userEntry) {
        const linkedCount = await prisma.userPlatformAccount.count({
          where: { userId: currentUserId, isVerified: true },
        });

        userStanding = {
          globalRank: userEntry.globalRank,
          totalScore: userEntry.totalScore,
          leetcodeScore: userEntry.leetcodeScore,
          codeforcesScore: userEntry.codeforcesScore,
          codechefScore: userEntry.codechefScore,
          atcoderScore: userEntry.atcoderScore,
          gfgScore: userEntry.gfgScore,
          hackerrankScore: userEntry.hackerrankScore,
          linkedPlatformsCount: linkedCount,
        };
      }
    }

    return NextResponse.json({
      success: true,
      ...data,
      userStanding,
    });
  } catch (error: unknown) {
    console.error("Error fetching leaderboard:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch leaderboard";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
