import { prisma } from "@/lib/prisma";
import { CodingPlatform } from "@/app/generated/prisma/client";
import {
  syncUserPlatform,
  recalculateAllRanks,
} from "@/lib/services/platform-sync.service";
import { invalidatePattern } from "@/lib/redis";

export interface SyncEngineOptions {
  force?: boolean;
  batchDelayMs?: number;
}

export interface SyncEngineResult {
  success: boolean;
  startTime: string;
  endTime: string;
  durationMs: number;
  totalUsersScanned: number;
  totalAccountsProcessed: number;
  successCount: number;
  errorCount: number;
  platformBreakdown: Record<string, number>;
  errors: Array<{
    userId: string;
    platform: string;
    username: string;
    error: string;
  }>;
}

export async function syncAllUsersStats(
  options: SyncEngineOptions = {}
): Promise<SyncEngineResult> {
  const startTime = new Date();
  const batchDelayMs = options.batchDelayMs ?? 200;

  console.log(`[CRON_ENGINE] [${startTime.toISOString()}] [INFO] Starting platform synchronization job`);

  const users = await prisma.user.findMany({
    select: {
      id: true,
      displayName: true,
      email: true,
      connectionsData: true,
      platformAccounts: {
        select: {
          id: true,
          platform: true,
          username: true,
          isVerified: true,
          lastSyncedAt: true,
        },
      },
    },
  });

  const totalUsersScanned = users.length;
  let totalAccountsProcessed = 0;
  let successCount = 0;
  let errorCount = 0;
  const platformBreakdown: Record<string, number> = {};
  const errors: SyncEngineResult["errors"] = [];

  const validPlatforms = Object.values(CodingPlatform);

  for (const user of users) {
    const userAccountsToSync: Array<{ platform: CodingPlatform; username: string }> = [];
    const seenPlatforms = new Set<CodingPlatform>();

    for (const acc of user.platformAccounts) {
      if (acc.username && acc.username.trim()) {
        userAccountsToSync.push({
          platform: acc.platform,
          username: acc.username.trim(),
        });
        seenPlatforms.add(acc.platform);
      }
    }

    const profilesObj = (user.connectionsData as any)?.codingProfiles;
    if (profilesObj && typeof profilesObj === "object") {
      for (const [key, obj] of Object.entries(profilesObj) as [string, { value?: string }][]) {
        const norm = key.toUpperCase().trim() as CodingPlatform;
        if (validPlatforms.includes(norm) && !seenPlatforms.has(norm) && obj?.value) {
          const raw = String(obj.value).trim();
          const handle = raw.replace(/\/$/, "").split("/").pop() || raw;
          if (handle) {
            userAccountsToSync.push({ platform: norm, username: handle });
            seenPlatforms.add(norm);
          }
        }
      }
    }

    if (userAccountsToSync.length === 0) {
      continue;
    }

    for (const target of userAccountsToSync) {
      totalAccountsProcessed++;
      platformBreakdown[target.platform] = (platformBreakdown[target.platform] || 0) + 1;

      try {
        const syncResult = await syncUserPlatform(user.id, target.platform, target.username);

        if (syncResult.success) {
          successCount++;
          console.log(
            `[CRON_ENGINE] [INFO] User: ${user.displayName || user.email || user.id} | Platform: ${target.platform} (@${target.username}) | Status: SUCCESS | Score: ${syncResult.points?.totalScore ?? 0}`
          );
        } else {
          errorCount++;
          const errDetail = syncResult.error || "Unknown fetch error";
          errors.push({
            userId: user.id,
            platform: target.platform,
            username: target.username,
            error: errDetail,
          });
          console.warn(
            `[CRON_ENGINE] [WARN] User: ${user.displayName || user.email || user.id} | Platform: ${target.platform} (@${target.username}) | Status: FAILED | Error: ${errDetail}`
          );
        }
      } catch (err: unknown) {
        errorCount++;
        const message = err instanceof Error ? err.message : "Sync exception";
        errors.push({
          userId: user.id,
          platform: target.platform,
          username: target.username,
          error: message,
        });
        console.error(
          `[CRON_ENGINE] [ERROR] User: ${user.displayName || user.email || user.id} | Platform: ${target.platform} (@${target.username}) | Exception: ${message}`
        );
      }

      if (batchDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, batchDelayMs));
      }
    }
  }

  try {
    await recalculateAllRanks();
    await invalidatePattern("cache:leaderboard*");
  } catch (rankErr) {
    console.warn(`[CRON_ENGINE] [WARN] Failed to recalculate ranks or invalidate cache:`, rankErr);
  }

  const endTime = new Date();
  const durationMs = endTime.getTime() - startTime.getTime();

  console.log(
    `[CRON_ENGINE] [${endTime.toISOString()}] [INFO] Job completed in ${(durationMs / 1000).toFixed(2)}s | Users scanned: ${totalUsersScanned} | Processed: ${totalAccountsProcessed} | Success: ${successCount} | Errors: ${errorCount}`
  );

  return {
    success: errorCount === 0 || successCount > 0,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    durationMs,
    totalUsersScanned,
    totalAccountsProcessed,
    successCount,
    errorCount,
    platformBreakdown,
    errors,
  };
}
