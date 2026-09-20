import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CodingPlatform } from "@/app/generated/prisma/client";
import { syncUserPlatform, updateLeaderboardEntryForUser, recalculateAllRanks } from "@/lib/services/platform-sync.service";
import { invalidatePattern } from "@/lib/redis";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing required userId" }, { status: 400 });
    }

    const accounts = await prisma.userPlatformAccount.findMany({
      where: { userId },
      orderBy: { platform: "asc" },
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

    const formatted = accounts.map((acc) => ({
      id: acc.id,
      platform: acc.platform,
      username: acc.username,
      isVerified: acc.isVerified,
      lastSyncedAt: acc.lastSyncedAt,
      syncError: acc.syncError,
      stats: latestStatByAccount.get(acc.id) || null,
    }));

    return NextResponse.json({ success: true, accounts: formatted });
  } catch (error: unknown) {
    console.error("Error fetching user platforms:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch platforms";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, platform, username } = body;

    if (!userId || !platform || !username) {
      return NextResponse.json(
        { error: "Missing required fields: userId, platform, and username are required." },
        { status: 400 }
      );
    }

    const validPlatforms = Object.values(CodingPlatform);
    const normalizedPlatform = platform.toUpperCase().trim() as CodingPlatform;

    if (!validPlatforms.includes(normalizedPlatform)) {
      return NextResponse.json(
        { error: `Invalid platform '${platform}'. Allowed: ${validPlatforms.join(", ")}` },
        { status: 400 }
      );
    }

    // Ensure User exists
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    // Sync & verify live platform profile
    const result = await syncUserPlatform(userId, normalizedPlatform, username);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || `Could not verify username "${username}" on ${platform}. Please verify the handle exists and is public.`,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully connected and verified ${normalizedPlatform} profile!`,
      result,
    });
  } catch (error: unknown) {
    console.error("Error linking user platform:", error);
    const message = error instanceof Error ? error.message : "Failed to link platform";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const platform = searchParams.get("platform");

    if (!userId || !platform) {
      return NextResponse.json({ error: "Missing required userId and platform" }, { status: 400 });
    }

    const normalizedPlatform = platform.toUpperCase().trim() as CodingPlatform;

    await prisma.userPlatformAccount.deleteMany({
      where: { userId, platform: normalizedPlatform },
    });

    // Update leaderboard entry and re-rank
    await updateLeaderboardEntryForUser(userId);
    await recalculateAllRanks();
    await invalidatePattern("cache:leaderboard*");

    return NextResponse.json({
      success: true,
      message: `Successfully disconnected ${normalizedPlatform}`,
    });
  } catch (error: unknown) {
    console.error("Error unlinking platform:", error);
    const message = error instanceof Error ? error.message : "Failed to unlink platform";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
