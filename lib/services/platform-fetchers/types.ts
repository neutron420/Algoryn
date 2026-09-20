import { CodingPlatform } from "@/app/generated/prisma/client";

export interface PlatformFetchResult {
  success: boolean;
  platform: CodingPlatform;
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  rating: number | null;
  rank: string | null;
  contestsCount: number | null;
  contributions: number | null;
  rawData?: unknown;
  error?: string;
}

export interface PlatformPointsBreakdown {
  platform: CodingPlatform;
  baseScore: number;
  problemPoints: number;
  ratingBonus: number;
  tierBonus: number;
  contestBonus: number;
  totalScore: number;
  details: {
    easyPoints?: number;
    mediumPoints?: number;
    hardPoints?: number;
    problemsSolvedCount?: number;
    rating?: number | null;
    tier?: string | null;
  };
}
