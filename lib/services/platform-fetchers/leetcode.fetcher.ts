import { CodingPlatform } from "@/app/generated/prisma/client";
import { PlatformFetchResult } from "./types";

const LEETCODE_GRAPHQL_ENDPOINT = "https://leetcode.com/graphql";

const USER_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      submissionCalendar
      profile {
        ranking
        reputation
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
      tagProblemCounts {
        advanced {
          tagName
          tagSlug
          problemsSolved
        }
        intermediate {
          tagName
          tagSlug
          problemsSolved
        }
        fundamental {
          tagName
          tagSlug
          problemsSolved
        }
      }
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
    }
  }
`;

const TOPIC_MAPPING: Record<string, string> = {
  "Array": "Arrays",
  "Dynamic Programming": "Dynamic Programming",
  "String": "Strings",
  "Hash Table": "Hashing",
  "Graph": "Graphs",
  "Graph Theory": "Graphs",
  "Depth-First Search": "Graphs",
  "Breadth-First Search": "Graphs",
  "Union-Find": "Graphs",
  "Shortest Path": "Graphs",
  "Recursion": "Recursion & Backtracking",
  "Backtracking": "Recursion & Backtracking",
  "Linked List": "Linked List",
  "Stack": "Stack & Queues",
  "Queue": "Stack & Queues",
  "Monotonic Stack": "Stack & Queues",
  "Monotonic Queue": "Stack & Queues",
  "Binary Search": "Binary Search",
  "Binary Tree": "Binary Trees",
  "Tree": "Binary Trees",
  "Math": "Mathematics",
  "Bit Manipulation": "Bit Manipulation",
  "Bitmask": "Bit Manipulation",
  "Greedy": "Greedy Algorithms",
  "Heap (Priority Queue)": "Heaps",
  "Sorting": "Sorting",
  "Binary Search Tree": "Binary Search Trees",
  "Trie": "Tries",
  "Segment Tree": "Advanced Range Data Structures",
  "Binary Indexed Tree": "Advanced Range Data Structures",
  "Ordered Set": "Ordered Sets & Maps",
};

export async function fetchLeetCodeStats(username: string): Promise<PlatformFetchResult> {
  const cleanUsername = username.trim();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(LEETCODE_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        query: USER_QUERY,
        variables: { username: cleanUsername },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        success: false,
        platform: CodingPlatform.LEETCODE,
        username: cleanUsername,
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        rating: null,
        rank: null,
        contestsCount: null,
        contributions: null,
        error: `LeetCode API responded with HTTP ${res.status}`,
      };
    }

    const data = await res.json();
    const matchedUser = data?.data?.matchedUser;

    if (!matchedUser) {
      return {
        success: false,
        platform: CodingPlatform.LEETCODE,
        username: cleanUsername,
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        rating: null,
        rank: null,
        contestsCount: null,
        contributions: null,
        error: `LeetCode profile "${cleanUsername}" not found`,
      };
    }

    const submitStats = matchedUser.submitStatsGlobal?.acSubmissionNum || [];
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    let totalSolved = 0;

    for (const item of submitStats) {
      if (item.difficulty === "Easy") easySolved = item.count;
      else if (item.difficulty === "Medium") mediumSolved = item.count;
      else if (item.difficulty === "Hard") hardSolved = item.count;
      else if (item.difficulty === "All") totalSolved = item.count;
    }

    if (totalSolved === 0 && (easySolved > 0 || mediumSolved > 0 || hardSolved > 0)) {
      totalSolved = easySolved + mediumSolved + hardSolved;
    }

    const contestRanking = data?.data?.userContestRanking;
    const rating = contestRanking?.rating ? Math.round(contestRanking.rating) : null;
    const contestsCount = contestRanking?.attendedContestsCount ?? null;
    const rank = contestRanking?.globalRanking
      ? `#${contestRanking.globalRanking}`
      : matchedUser.profile?.ranking
      ? `#${matchedUser.profile.ranking}`
      : null;
    const contributions = matchedUser.profile?.reputation ?? null;

    // Parse submissionCalendar (epoch timestamp -> submission count)
    const dailySubmissions: Record<string, number> = {};
    if (matchedUser.submissionCalendar) {
      try {
        const rawCalendar = JSON.parse(matchedUser.submissionCalendar);
        for (const [secStr, count] of Object.entries(rawCalendar)) {
          const epoch = parseInt(secStr, 10);
          if (!isNaN(epoch) && typeof count === "number") {
            const dateStr = new Date(epoch * 1000).toISOString().split("T")[0];
            dailySubmissions[dateStr] = (dailySubmissions[dateStr] || 0) + count;
          }
        }
      } catch {
        // Fallback gracefully if JSON parse fails
      }
    }

    // Parse tagProblemCounts into topic stats
    const topicStats: Record<string, number> = {};
    const tagsObj = matchedUser.tagProblemCounts;
    if (tagsObj) {
      const allTags: Array<{ tagName: string; tagSlug?: string; problemsSolved: number }> = [
        ...(tagsObj.fundamental || []),
        ...(tagsObj.intermediate || []),
        ...(tagsObj.advanced || []),
      ];

      for (const t of allTags) {
        const targetTopic = TOPIC_MAPPING[t.tagName] || t.tagName;
        topicStats[targetTopic] = Math.max(topicStats[targetTopic] || 0, t.problemsSolved);
      }
    }

    return {
      success: true,
      platform: CodingPlatform.LEETCODE,
      username: cleanUsername,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      rating,
      rank,
      contestsCount,
      contributions,
      rawData: {
        easySolved,
        mediumSolved,
        hardSolved,
        totalSolved,
        rating,
        ranking: rank,
        contestsCount,
        dailySubmissions,
        topicStats,
      },
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const message = err instanceof Error ? err.message : "Failed to fetch LeetCode data";
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return {
      success: false,
      platform: CodingPlatform.LEETCODE,
      username: cleanUsername,
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      rating: null,
      rank: null,
      contestsCount: null,
      contributions: null,
      error: isTimeout ? "LeetCode request timed out" : message,
    };
  }
}
