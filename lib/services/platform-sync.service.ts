import { prisma } from "@/lib/prisma";
import { CodingPlatform } from "@/app/generated/prisma/client";
import { fetchPlatformStats, PlatformFetchResult, PlatformPointsBreakdown } from "./platform-fetchers";
import { invalidatePattern } from "@/lib/redis";


export function calculatePlatformScore(
  platform: CodingPlatform,
  stats: Partial<PlatformFetchResult>
): PlatformPointsBreakdown {
  const totalSolved = stats.totalSolved || 0;
  const easySolved = stats.easySolved || 0;
  const mediumSolved = stats.mediumSolved || 0;
  const hardSolved = stats.hardSolved || 0;
  const rating = stats.rating || 0;
  const contestsCount = stats.contestsCount || 0;
  const contributions = stats.contributions || 0;

  let problemPoints = 0;
  let ratingBonus = 0;
  let tierBonus = 0;
  let contestBonus = 0;
  const details: PlatformPointsBreakdown["details"] = {
    problemsSolvedCount: totalSolved,
    rating: rating || null,
  };

  switch (platform) {
    case CodingPlatform.LEETCODE: {
      // Points per problem: Easy = 2 pts, Medium = 5 pts, Hard = 10 pts
      const easyPts = easySolved * 2;
      const medPts = mediumSolved * 5;
      const hardPts = hardSolved * 10;
      problemPoints = easyPts + medPts + hardPts;

      // Fallback if difficulty breakdown not available
      if (problemPoints === 0 && totalSolved > 0) {
        problemPoints = totalSolved * 4;
      }

      // Contest Rating points
      if (rating >= 1400) {
        ratingBonus = Math.floor((rating - 1400) * 0.5);
      }

      // Knight / Guardian milestone badges
      if (rating >= 2150) {
        tierBonus = 350; // Guardian
        details.tier = "Guardian";
      } else if (rating >= 1850) {
        tierBonus = 150; // Knight
        details.tier = "Knight";
      }

      // Contests participation: 5 pts per contest attended (max 200)
      contestBonus = Math.min(200, contestsCount * 5);

      details.easyPoints = easyPts;
      details.mediumPoints = medPts;
      details.hardPoints = hardPts;
      break;
    }

    case CodingPlatform.CODEFORCES: {
      // 5 points per unique solved problem
      problemPoints = totalSolved * 5;

      // Rating bonus: 0.6 pts per rating point above 800
      if (rating >= 800) {
        ratingBonus = Math.floor((rating - 800) * 0.6);
      }

      // Rank tier bonuses
      if (rating >= 2200) {
        tierBonus = 1200; // Master / Grandmaster
        details.tier = "Master+";
      } else if (rating >= 1900) {
        tierBonus = 850; // Candidate Master
        details.tier = "Candidate Master";
      } else if (rating >= 1600) {
        tierBonus = 500; // Expert
        details.tier = "Expert";
      } else if (rating >= 1400) {
        tierBonus = 250; // Specialist
        details.tier = "Specialist";
      } else if (rating >= 1200) {
        tierBonus = 100; // Pupil
        details.tier = "Pupil";
      }

      // Contribution bonus: 10 pts per positive contribution
      if (contributions > 0) {
        contestBonus = Math.min(150, contributions * 10);
      }
      break;
    }

    case CodingPlatform.CODECHEF: {
      // 3 points per solved problem
      problemPoints = totalSolved * 3;

      // Rating bonus
      if (rating >= 1000) {
        ratingBonus = Math.floor((rating - 1000) * 0.4);
      }

      // Star tier bonuses
      if (rating >= 2200) {
        tierBonus = 1200;
        details.tier = "6★ / 7★";
      } else if (rating >= 2000) {
        tierBonus = 850;
        details.tier = "5★";
      } else if (rating >= 1800) {
        tierBonus = 550;
        details.tier = "4★";
      } else if (rating >= 1600) {
        tierBonus = 300;
        details.tier = "3★";
      } else if (rating >= 1400) {
        tierBonus = 150;
        details.tier = "2★";
      } else if (rating >= 1000) {
        tierBonus = 50;
        details.tier = "1★";
      }
      break;
    }

    case CodingPlatform.GEEKSFORGEEKS: {
      // School/Basic: 1 pt, Easy: 2 pts, Medium: 4 pts, Hard: 8 pts
      const easyPts = easySolved * 2;
      const medPts = mediumSolved * 4;
      const hardPts = hardSolved * 8;
      problemPoints = easyPts + medPts + hardPts;

      if (problemPoints === 0 && totalSolved > 0) {
        problemPoints = totalSolved * 2.5;
      }

      // Coding score bonus
      if (rating > 0) {
        ratingBonus = Math.floor(rating * 0.3);
      }

      details.easyPoints = easyPts;
      details.mediumPoints = medPts;
      details.hardPoints = hardPts;
      break;
    }

    case CodingPlatform.ATCODER: {
      // 5 points per accepted problem
      problemPoints = totalSolved * 5;

      // Rating points
      if (rating > 0) {
        ratingBonus = Math.floor(rating * 0.7);
      }

      // Color tier bonuses
      if (rating >= 2000) {
        tierBonus = 1200;
        details.tier = "Yellow / Red";
      } else if (rating >= 1600) {
        tierBonus = 850;
        details.tier = "Blue";
      } else if (rating >= 1200) {
        tierBonus = 500;
        details.tier = "Cyan";
      } else if (rating >= 800) {
        tierBonus = 250;
        details.tier = "Green";
      } else if (rating >= 400) {
        tierBonus = 100;
        details.tier = "Brown";
      }
      break;
    }

    case CodingPlatform.HACKERRANK: {
      // 15 pts per domain badge
      const badgesCount = contributions || 0;
      tierBonus = badgesCount * 15;

      // Problem solving stars & score
      problemPoints = Math.round(totalSolved * 3);
      if (rating > 0) {
        ratingBonus = Math.floor(rating * 0.2);
      }
      break;
    }

    default: {
      problemPoints = totalSolved * 3;
      break;
    }
  }

  const totalScore = Math.round(problemPoints + ratingBonus + tierBonus + contestBonus);

  return {
    platform,
    baseScore: 0,
    problemPoints,
    ratingBonus,
    tierBonus,
    contestBonus,
    totalScore,
    details,
  };
}

/**
 * Synchronizes a single platform account for a user, records history, and updates Leaderboard.
 */
export async function syncUserPlatform(
  userId: string,
  platform: CodingPlatform,
  username: string
) {
  const cleanUsername = username.trim();

  // 1. Fetch live platform stats
  const fetchResult = await fetchPlatformStats(platform, cleanUsername);

  if (!fetchResult.success) {
    // Record error on the account
    await prisma.userPlatformAccount.upsert({
      where: { userId_platform: { userId, platform } },
      update: {
        syncError: fetchResult.error || "Failed to fetch platform data",
        updatedAt: new Date(),
      },
      create: {
        userId,
        platform,
        username: cleanUsername,
        isVerified: false,
        syncError: fetchResult.error || "Failed to fetch platform data",
      },
    });

    return {
      success: false,
      platform,
      username: cleanUsername,
      error: fetchResult.error,
    };
  }

  // 2. Calculate standardized points for this platform
  const pointsBreakdown = calculatePlatformScore(platform, fetchResult);

  // 3. Upsert UserPlatformAccount
  const account = await prisma.userPlatformAccount.upsert({
    where: { userId_platform: { userId, platform } },
    update: {
      username: cleanUsername,
      isVerified: true,
      lastSyncedAt: new Date(),
      syncError: null,
      updatedAt: new Date(),
    },
    create: {
      userId,
      platform,
      username: cleanUsername,
      isVerified: true,
      lastSyncedAt: new Date(),
      syncError: null,
    },
  });

  // 4. Record new UserPlatformStats entry
  await prisma.userPlatformStats.create({
    data: {
      accountId: account.id,
      platform,
      totalSolved: fetchResult.totalSolved,
      easySolved: fetchResult.easySolved,
      mediumSolved: fetchResult.mediumSolved,
      hardSolved: fetchResult.hardSolved,
      rating: fetchResult.rating,
      rank: fetchResult.rank,
      contestsCount: fetchResult.contestsCount,
      contributions: fetchResult.contributions,
      score: pointsBreakdown.totalScore,
      rawData: fetchResult.rawData ?? undefined,
      fetchedAt: new Date(),
    },
  });

  // 5. Update Leaderboard Entry for this user
  await updateLeaderboardEntryForUser(userId);

  // 6. Recalculate global ranks
  await recalculateAllRanks();

  // 7. Invalidate cached leaderboard
  await invalidatePattern("cache:leaderboard*");

  return {
    success: true,
    platform,
    username: cleanUsername,
    stats: fetchResult,
    points: pointsBreakdown,
  };
}

/**
 * Synchronizes all linked platforms for a given user.
 */
export async function syncAllUserPlatforms(userId: string) {
  const accounts = await prisma.userPlatformAccount.findMany({
    where: { userId },
  });

  const results = [];
  for (const account of accounts) {
    try {
      const res = await syncUserPlatform(userId, account.platform, account.username);
      results.push(res);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sync failed";
      results.push({
        success: false,
        platform: account.platform,
        username: account.username,
        error: message,
      });
    }
  }

  return results;
}

/**
 * Computes scores across all platforms for a user and updates their LeaderboardEntry.
 */
export async function updateLeaderboardEntryForUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { displayName: true, photoUrl: true },
  });

  const accounts = await prisma.userPlatformAccount.findMany({
    where: { userId, isVerified: true },
  });

  const accountIds = accounts.map((a) => a.id);
  const allStats = accountIds.length > 0
    ? await prisma.userPlatformStats.findMany({
        where: { accountId: { in: accountIds } },
        orderBy: { fetchedAt: "desc" },
      })
    : [];

  const latestStatByAccount = new Map<number, (typeof allStats)[0]>();
  for (const stat of allStats) {
    if (!latestStatByAccount.has(stat.accountId)) {
      latestStatByAccount.set(stat.accountId, stat);
    }
  }

  let leetcodeScore = 0;
  let codeforcesScore = 0;
  let codechefScore = 0;
  let atcoderScore = 0;
  let gfgScore = 0;
  let hackerrankScore = 0;
  let hackerearthScore = 0;
  let interviewbitScore = 0;

  for (const acc of accounts) {
    const latestStat = latestStatByAccount.get(acc.id);
    if (!latestStat) continue;

    const score = latestStat.score || calculatePlatformScore(acc.platform, latestStat).totalScore;

    switch (acc.platform) {
      case CodingPlatform.LEETCODE:
        leetcodeScore = score;
        break;
      case CodingPlatform.CODEFORCES:
        codeforcesScore = score;
        break;
      case CodingPlatform.CODECHEF:
        codechefScore = score;
        break;
      case CodingPlatform.GEEKSFORGEEKS:
        gfgScore = score;
        break;
      case CodingPlatform.ATCODER:
        atcoderScore = score;
        break;
      case CodingPlatform.HACKERRANK:
        hackerrankScore = score;
        break;
      case CodingPlatform.HACKEREARTH:
        hackerearthScore = score;
        break;
      case CodingPlatform.INTERVIEWBIT:
        interviewbitScore = score;
        break;
    }
  }

  const totalScore =
    leetcodeScore +
    codeforcesScore +
    codechefScore +
    atcoderScore +
    gfgScore +
    hackerrankScore +
    hackerearthScore +
    interviewbitScore;

  const existingEntry = await prisma.leaderboardEntry.findFirst({
    where: { userId },
  });

  if (existingEntry) {
    await prisma.leaderboardEntry.update({
      where: { id: existingEntry.id },
      data: {
        displayName: user?.displayName,
        photoUrl: user?.photoUrl,
        leetcodeScore,
        codeforcesScore,
        codechefScore,
        atcoderScore,
        gfgScore,
        hackerrankScore,
        hackerearthScore,
        interviewbitScore,
        totalScore,
        updatedAt: new Date(),
      },
    });
  } else {
    await prisma.leaderboardEntry.create({
      data: {
        userId,
        displayName: user?.displayName,
        photoUrl: user?.photoUrl,
        leetcodeScore,
        codeforcesScore,
        codechefScore,
        atcoderScore,
        gfgScore,
        hackerrankScore,
        hackerearthScore,
        interviewbitScore,
        totalScore,
        globalRank: 0,
      },
    });
  }
}

/**
 * Re-ranks all entries in LeaderboardEntry by totalScore DESC.
 */
export async function recalculateAllRanks() {
  const entries = await prisma.leaderboardEntry.findMany({
    orderBy: [{ totalScore: "desc" }, { updatedAt: "asc" }],
    select: { id: true },
  });

  for (let i = 0; i < entries.length; i++) {
    const rank = i + 1;
    await prisma.leaderboardEntry.update({
      where: { id: entries[i].id },
      data: { globalRank: rank },
    });
  }
}
