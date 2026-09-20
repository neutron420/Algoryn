import { CodingPlatform } from "@/app/generated/prisma/client";
import { PlatformFetchResult } from "./types";

export async function fetchAtCoderStats(username: string): Promise<PlatformFetchResult> {
  const cleanUsername = username.trim();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const [acRes, infoRes] = await Promise.all([
      fetch(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/accepted_count?user=${encodeURIComponent(cleanUsername)}`, {
        headers: { "User-Agent": "AlgorynCodePrep/1.0" },
        signal: controller.signal,
      }),
      fetch(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/info?user=${encodeURIComponent(cleanUsername)}`, {
        headers: { "User-Agent": "AlgorynCodePrep/1.0" },
        signal: controller.signal,
      }),
    ]);

    clearTimeout(timeoutId);

    if (!acRes.ok && !infoRes.ok) {
      return {
        success: false,
        platform: CodingPlatform.ATCODER,
        username: cleanUsername,
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        rating: null,
        rank: null,
        contestsCount: null,
        contributions: null,
        error: `AtCoder user "${cleanUsername}" not found`,
      };
    }

    const acData = acRes.ok ? await acRes.json() : null;
    const infoData = infoRes.ok ? await infoRes.json() : null;

    const totalSolved = acData?.count ?? 0;
    const rating = infoData?.rating ?? null;
    const rank = rating ? (rating < 400 ? "Gray" : rating < 800 ? "Brown" : rating < 1200 ? "Green" : rating < 1600 ? "Cyan" : rating < 2000 ? "Blue" : rating < 2400 ? "Yellow" : "Red") : null;

    return {
      success: true,
      platform: CodingPlatform.ATCODER,
      username: cleanUsername,
      totalSolved,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      rating,
      rank,
      contestsCount: null,
      contributions: null,
      rawData: {
        acceptedCount: totalSolved,
        rating,
        highestRating: infoData?.highest_rating ?? null,
      },
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const message = err instanceof Error ? err.message : "Failed to fetch AtCoder data";
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return {
      success: false,
      platform: CodingPlatform.ATCODER,
      username: cleanUsername,
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      rating: null,
      rank: null,
      contestsCount: null,
      contributions: null,
      error: isTimeout ? "AtCoder request timed out" : message,
    };
  }
}
