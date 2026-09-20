import { CodingPlatform } from "@/app/generated/prisma/client";
import { PlatformFetchResult } from "./types";

export async function fetchGeeksforGeeksStats(username: string): Promise<PlatformFetchResult> {
  const cleanUsername = username.trim();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`https://www.geeksforgeeks.org/user/${encodeURIComponent(cleanUsername)}/`, {
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
        platform: CodingPlatform.GEEKSFORGEEKS,
        username: cleanUsername,
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        rating: null,
        rank: null,
        contestsCount: null,
        contributions: null,
        error: `GeeksforGeeks user "${cleanUsername}" not found`,
      };
    }

    const html = await res.text();

    if (html.includes("User not found") || html.includes("404 - Page Not Found")) {
      return {
        success: false,
        platform: CodingPlatform.GEEKSFORGEEKS,
        username: cleanUsername,
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        rating: null,
        rank: null,
        contestsCount: null,
        contributions: null,
        error: `GeeksforGeeks profile "${cleanUsername}" not found`,
      };
    }

    // Coding score
    const scoreMatch = html.match(/Overall Coding Score[\s\S]*?>([0-9]+)</i) ||
                       html.match(/score_card_value[^>]*>([0-9]+)</i);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;

    // Problems Solved
    const solvedMatch = html.match(/Problems Solved[\s\S]*?>([0-9]+)</i) ||
                        html.match(/Total Problems Solved[\s\S]*?>([0-9]+)</i);
    let totalSolved = solvedMatch ? parseInt(solvedMatch[1], 10) : 0;

    // Difficulty breakdowns
    const schoolMatch = html.match(/SCHOOL[\s\S]*?\((\d+)\)/i);
    const basicMatch = html.match(/BASIC[\s\S]*?\((\d+)\)/i);
    const easyMatch = html.match(/EASY[\s\S]*?\((\d+)\)/i);
    const medMatch = html.match(/MEDIUM[\s\S]*?\((\d+)\)/i);
    const hardMatch = html.match(/HARD[\s\S]*?\((\d+)\)/i);

    const easySolved = (schoolMatch ? parseInt(schoolMatch[1], 10) : 0) +
                       (basicMatch ? parseInt(basicMatch[1], 10) : 0) +
                       (easyMatch ? parseInt(easyMatch[1], 10) : 0);
    const mediumSolved = medMatch ? parseInt(medMatch[1], 10) : 0;
    const hardSolved = hardMatch ? parseInt(hardMatch[1], 10) : 0;

    if (totalSolved === 0 && (easySolved > 0 || mediumSolved > 0 || hardSolved > 0)) {
      totalSolved = easySolved + mediumSolved + hardSolved;
    }

    // College rank / Global rank if present
    const rankMatch = html.match(/Global Rank[\s\S]*?>([0-9]+)</i) ||
                      html.match(/Rank[\s\S]*?>([0-9]+)</i);
    const rank = rankMatch ? `#${rankMatch[1]}` : null;

    return {
      success: true,
      platform: CodingPlatform.GEEKSFORGEEKS,
      username: cleanUsername,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      rating: score, // Store coding score in rating
      rank,
      contestsCount: null,
      contributions: null,
      rawData: {
        codingScore: score,
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
      },
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const message = err instanceof Error ? err.message : "Failed to fetch GeeksforGeeks data";
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return {
      success: false,
      platform: CodingPlatform.GEEKSFORGEEKS,
      username: cleanUsername,
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      rating: null,
      rank: null,
      contestsCount: null,
      contributions: null,
      error: isTimeout ? "GeeksforGeeks request timed out" : message,
    };
  }
}
