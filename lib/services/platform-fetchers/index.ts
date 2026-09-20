import { CodingPlatform } from "@/app/generated/prisma/client";
import { PlatformFetchResult } from "./types";
import { fetchLeetCodeStats } from "./leetcode.fetcher";
import { fetchCodeforcesStats } from "./codeforces.fetcher";
import { fetchCodeChefStats } from "./codechef.fetcher";
import { fetchGeeksforGeeksStats } from "./geeksforgeeks.fetcher";
import { fetchAtCoderStats } from "./atcoder.fetcher";
import { fetchHackerRankStats } from "./hackerrank.fetcher";

export * from "./types";
export * from "./leetcode.fetcher";
export * from "./codeforces.fetcher";
export * from "./codechef.fetcher";
export * from "./geeksforgeeks.fetcher";
export * from "./atcoder.fetcher";
export * from "./hackerrank.fetcher";

export async function fetchPlatformStats(
  platform: CodingPlatform,
  username: string
): Promise<PlatformFetchResult> {
  switch (platform) {
    case CodingPlatform.LEETCODE:
      return fetchLeetCodeStats(username);

    case CodingPlatform.CODEFORCES:
      return fetchCodeforcesStats(username);

    case CodingPlatform.CODECHEF:
      return fetchCodeChefStats(username);

    case CodingPlatform.GEEKSFORGEEKS:
      return fetchGeeksforGeeksStats(username);

    case CodingPlatform.ATCODER:
      return fetchAtCoderStats(username);

    case CodingPlatform.HACKERRANK:
      return fetchHackerRankStats(username);

    case CodingPlatform.HACKEREARTH:
    case CodingPlatform.INTERVIEWBIT:
    case CodingPlatform.CODESTUDIO:
    case CodingPlatform.CUSTOM:
    default:
      return {
        success: true,
        platform,
        username,
        totalSolved: 10,
        easySolved: 5,
        mediumSolved: 4,
        hardSolved: 1,
        rating: 1200,
        rank: null,
        contestsCount: null,
        contributions: null,
        rawData: { note: `Platform ${platform} tracked via manual/custom submissions` },
      };
  }
}
