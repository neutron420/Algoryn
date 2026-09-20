import { CodingPlatform } from "@/app/generated/prisma/client";
import { PlatformFetchResult } from "./types";

export async function fetchHackerRankStats(username: string): Promise<PlatformFetchResult> {
  const cleanUsername = username.trim();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const [badgesRes, scoresRes] = await Promise.all([
      fetch(`https://www.hackerrank.com/rest/hackers/${encodeURIComponent(cleanUsername)}/badges`, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
        signal: controller.signal,
      }),
      fetch(`https://www.hackerrank.com/rest/hackers/${encodeURIComponent(cleanUsername)}/scores_elo`, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
        signal: controller.signal,
      }),
    ]);

    clearTimeout(timeoutId);

    if (!badgesRes.ok && !scoresRes.ok) {
      return {
        success: false,
        platform: CodingPlatform.HACKERRANK,
        username: cleanUsername,
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        rating: null,
        rank: null,
        contestsCount: null,
        contributions: null,
        error: `HackerRank user "${cleanUsername}" not found`,
      };
    }

    const badgesData = badgesRes.ok ? await badgesRes.json() : null;
    const scoresData = scoresRes.ok ? await scoresRes.json() : null;

    let totalBadges = 0;
    let totalStars = 0;
    let totalSolved = 0;

    if (Array.isArray(badgesData?.models)) {
      totalBadges = badgesData.models.length;
      for (const badge of badgesData.models) {
        totalStars += badge.stars || 0;
        totalSolved += badge.solved || 0;
      }
    }

    let maxScore = 0;
    if (Array.isArray(scoresData?.models)) {
      for (const item of scoresData.models) {
        if (item.score && item.score > maxScore) {
          maxScore = Math.round(item.score);
        }
      }
    }

    return {
      success: true,
      platform: CodingPlatform.HACKERRANK,
      username: cleanUsername,
      totalSolved: totalSolved || totalStars * 5,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      rating: maxScore || totalStars * 50,
      rank: totalStars ? `${totalStars} Stars` : null,
      contestsCount: null,
      contributions: totalBadges,
      rawData: {
        totalBadges,
        totalStars,
        totalSolved,
        maxScore,
      },
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const message = err instanceof Error ? err.message : "Failed to fetch HackerRank data";
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return {
      success: false,
      platform: CodingPlatform.HACKERRANK,
      username: cleanUsername,
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      rating: null,
      rank: null,
      contestsCount: null,
      contributions: null,
      error: isTimeout ? "HackerRank request timed out" : message,
    };
  }
}
