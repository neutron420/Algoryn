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

    // 2. Fetch solved problems from status
    let totalSolved = 0;
    try {
      const statusRes = await fetch(
        `https://codeforces.com/api/user.status?handle=${encodeURIComponent(cleanUsername)}&from=1&count=5000`,
        { headers: { "User-Agent": "AlgorynCodePrep/1.0" }, signal: controller.signal }
      );
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        if (statusData.status === "OK" && Array.isArray(statusData.result)) {
          const solvedSet = new Set<string>();
          for (const sub of statusData.result) {
            if (sub.verdict === "OK" && sub.problem) {
              const problemId = `${sub.problem.contestId || ""}-${sub.problem.index || ""}`;
              solvedSet.add(problemId);
            }
          }
          totalSolved = solvedSet.size;
        }
      }
    } catch {
      // Non-fatal if submissions query times out
    }

    clearTimeout(timeoutId);

    return {
      success: true,
      platform: CodingPlatform.CODEFORCES,
      username: cleanUsername,
      totalSolved,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      rating: user.rating ?? null,
      rank: user.rank ?? null,
      contestsCount: null,
      contributions: user.contribution ?? 0,
      rawData: {
        rank: user.rank,
        maxRank: user.maxRank,
        rating: user.rating,
        maxRating: user.maxRating,
        contribution: user.contribution,
        totalSolved,
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
