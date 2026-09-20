import { CodingPlatform } from "@/app/generated/prisma/client";
import { PlatformFetchResult } from "./types";

export async function fetchCodeChefStats(username: string): Promise<PlatformFetchResult> {
  const cleanUsername = username.trim();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`https://www.codechef.com/users/${encodeURIComponent(cleanUsername)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        success: false,
        platform: CodingPlatform.CODECHEF,
        username: cleanUsername,
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        rating: null,
        rank: null,
        contestsCount: null,
        contributions: null,
        error: `CodeChef user "${cleanUsername}" not found or profile is private`,
      };
    }

    const html = await res.text();

    if (html.includes("User not found") || html.includes("could not be found")) {
      return {
        success: false,
        platform: CodingPlatform.CODECHEF,
        username: cleanUsername,
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        rating: null,
        rank: null,
        contestsCount: null,
        contributions: null,
        error: `CodeChef profile "${cleanUsername}" not found`,
      };
    }

    // 1. Rating
    const ratingMatch = html.match(/class="rating-number"[^>]*>([0-9]+)<\/div>/i) ||
                        html.match(/class="rating"[^>]*>([0-9]+)/i);
    const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : null;

    // 2. Stars
    const starMatch = html.match(/class="rating-star"[^>]*>([\s\S]*?)<\/span>/i);
    const starCount = starMatch ? (starMatch[1].match(/★/g) || []).length : (rating ? (rating < 1400 ? 1 : rating < 1600 ? 2 : rating < 1800 ? 3 : rating < 2000 ? 4 : rating < 2200 ? 5 : rating < 2500 ? 6 : 7) : null);
    const rank = starCount ? `${starCount}★` : null;

    // 3. Total Solved Problems
    const solvedMatch = html.match(/Total Problems Solved:\s*([0-9]+)/i) ||
                        html.match(/Problems Solved[\s\S]*?([0-9]+)\s*<\/h3>/i) ||
                        html.match(/([0-9]+)\s*problems? solved/i);
    const totalSolved = solvedMatch ? parseInt(solvedMatch[1], 10) : 0;

    return {
      success: true,
      platform: CodingPlatform.CODECHEF,
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
        rating,
        stars: starCount,
        totalSolved,
      },
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const message = err instanceof Error ? err.message : "Failed to fetch CodeChef data";
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return {
      success: false,
      platform: CodingPlatform.CODECHEF,
      username: cleanUsername,
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      rating: null,
      rank: null,
      contestsCount: null,
      contributions: null,
      error: isTimeout ? "CodeChef request timed out" : message,
    };
  }
}
