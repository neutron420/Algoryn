import { CodingPlatform } from "@/app/generated/prisma/client";
import { PlatformFetchResult } from "./types";

export async function fetchCodeforcesStats(username: string): Promise<PlatformFetchResult> {
  const cleanUsername = username.trim();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    // 1. Fetch user info
    const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(cleanUsername)}`, {
      headers: { "User-Agent": "AlgorynCodePrep/1.0" },
      signal: controller.signal,
    });

    if (!infoRes.ok) {
      clearTimeout(timeoutId);
      return {
        success: false,
        platform: CodingPlatform.CODEFORCES,
        username: cleanUsername,
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        rating: null,
        rank: null,
        contestsCount: null,
        contributions: null,
        error: `Codeforces user "${cleanUsername}" not found`,
      };
    }

    const infoData = await infoRes.json();
    if (infoData.status !== "OK" || !infoData.result?.[0]) {
      clearTimeout(timeoutId);
      return {
        success: false,
        platform: CodingPlatform.CODEFORCES,
        username: cleanUsername,
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        rating: null,
        rank: null,
        contestsCount: null,
        contributions: null,
        error: infoData.comment || `Codeforces profile "${cleanUsername}" not found`,
      };
    }

    const user = infoData.result[0];

    let totalSolved = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    const dailySubmissions: Record<string, number> = {};
    const topicStats: Record<string, number> = {};
    const solvedSet = new Set<string>();

    const CF_TOPIC_MAPPING: Record<string, string> = {
      "dp": "Dynamic Programming",
      "strings": "Strings",
      "string suffix structures": "Strings",
      "graphs": "Graphs",
      "dfs and similar": "Graphs",
      "trees": "Binary Trees",
      "data structures": "Stack & Queues",
      "math": "Mathematics",
      "number theory": "Mathematics",
      "combinatorics": "Mathematics",
      "greedy": "Greedy Algorithms",
      "binary search": "Binary Search",
      "sortings": "Sorting",
      "bitmasks": "Bit Manipulation",
      "two pointers": "Arrays",
      "divide and conquer": "Recursion & Backtracking",
      "brute force": "Recursion & Backtracking",
      "dsu": "Graphs",
      "shortest paths": "Graphs",
      "probabilities": "Mathematics",
      "geometry": "Mathematics",
      "games": "Dynamic Programming",
      "matrices": "Arrays",
      "flows": "Graphs",
      "hashing": "Hashing",
      "ternary search": "Binary Search",
    };

    try {
      const statusRes = await fetch(
        `https://codeforces.com/api/user.status?handle=${encodeURIComponent(cleanUsername)}&from=1&count=5000`,
        { headers: { "User-Agent": "AlgorynCodePrep/1.0" }, signal: controller.signal }
      );
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        if (statusData.status === "OK" && Array.isArray(statusData.result)) {
          for (const sub of statusData.result) {
            // Track submission activity calendar
            if (sub.creationTimeSeconds) {
              const d = new Date(sub.creationTimeSeconds * 1000).toISOString().split("T")[0];
              dailySubmissions[d] = (dailySubmissions[d] || 0) + 1;
            }

            // Track unique accepted problems and topic tags
            if (sub.verdict === "OK" && sub.problem) {
              const problemId = `${sub.problem.contestId || ""}-${sub.problem.index || ""}`;
              if (!solvedSet.has(problemId)) {
                solvedSet.add(problemId);

                const r = sub.problem.rating || 0;
                if (r <= 1200) easySolved++;
                else if (r <= 1600) mediumSolved++;
                else hardSolved++;

                if (Array.isArray(sub.problem.tags)) {
                  for (const rawTag of sub.problem.tags) {
                    const mappedTopic = CF_TOPIC_MAPPING[rawTag.toLowerCase()];
                    if (mappedTopic) {
                      topicStats[mappedTopic] = (topicStats[mappedTopic] || 0) + 1;
                    }
                  }
                }
              }
            }
          }
          totalSolved = solvedSet.size;
        }
      }
    } catch {
      // Non-fatal if submissions query times out
    }

    // 3. Fetch rated contests count from user.rating
    let contestsCount: number | null = null;
    try {
      const ratingRes = await fetch(
        `https://codeforces.com/api/user.rating?handle=${encodeURIComponent(cleanUsername)}`,
        { headers: { "User-Agent": "AlgorynCodePrep/1.0" }, signal: controller.signal }
      );
      if (ratingRes.ok) {
        const ratingData = await ratingRes.json();
        if (ratingData.status === "OK" && Array.isArray(ratingData.result)) {
          contestsCount = ratingData.result.length;
        }
      }
    } catch {
      // Non-fatal
    }

    clearTimeout(timeoutId);

    return {
      success: true,
      platform: CodingPlatform.CODEFORCES,
      username: cleanUsername,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      rating: user.rating ?? null,
      rank: user.rank ?? null,
      contestsCount,
      contributions: user.contribution ?? 0,
      rawData: {
        rank: user.rank,
        maxRank: user.maxRank,
        rating: user.rating,
        maxRating: user.maxRating,
        contribution: user.contribution,
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        contestsCount,
        dailySubmissions,
        topicStats,
      },
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const message = err instanceof Error ? err.message : "Failed to fetch Codeforces data";
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return {
      success: false,
      platform: CodingPlatform.CODEFORCES,
      username: cleanUsername,
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      rating: null,
      rank: null,
      contestsCount: null,
      contributions: null,
      error: isTimeout ? "Codeforces request timed out" : message,
    };
  }
}
