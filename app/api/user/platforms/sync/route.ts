import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CodingPlatform } from "@/app/generated/prisma/client";
import { syncUserPlatform, syncAllUserPlatforms } from "@/lib/services/platform-sync.service";

const SYNC_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, platform, force } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing required userId" }, { status: 400 });
    }

    if (platform) {
      const normalizedPlatform = platform.toUpperCase().trim() as CodingPlatform;

      const account = await prisma.userPlatformAccount.findUnique({
        where: { userId_platform: { userId, platform: normalizedPlatform } },
      });

      if (!account) {
        return NextResponse.json(
          { error: `No linked account found for platform ${normalizedPlatform}` },
          { status: 404 }
        );
      }

      // Check cooldown
      if (!force && account.lastSyncedAt) {
        const elapsed = Date.now() - new Date(account.lastSyncedAt).getTime();
        if (elapsed < SYNC_COOLDOWN_MS) {
          const remainingSeconds = Math.ceil((SYNC_COOLDOWN_MS - elapsed) / 1000);
          return NextResponse.json({
            success: false,
            cooldown: true,
            remainingSeconds,
            message: `Please wait ${remainingSeconds} seconds before re-syncing ${normalizedPlatform}.`,
          });
        }
      }

      const result = await syncUserPlatform(userId, normalizedPlatform, account.username);
      return NextResponse.json({ success: result.success, result });
    }

    // Sync all linked platforms for this user
    const results = await syncAllUserPlatforms(userId);
    return NextResponse.json({ success: true, results });
  } catch (error: unknown) {
    console.error("Error triggering sync:", error);
    const message = error instanceof Error ? error.message : "Failed to trigger sync";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
