import { NextResponse } from "next/server";
import { syncAllUsersStats } from "@/cron/sync-engine";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds max execution time for serverless

/**
 * GET or POST handler for external or automated cron pings (e.g., Vercel Cron, Cron-Job.org)
 */
async function handleCronRequest(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const secretKey = searchParams.get("key") || searchParams.get("secret");
    const authHeader = req.headers.get("authorization");
    const bearerSecret = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const expectedSecret = process.env.CRON_SECRET;

    // If a CRON_SECRET is configured in environment variables, verify it
    if (expectedSecret) {
      const provided = secretKey || bearerSecret;
      if (provided !== expectedSecret) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid or missing cron secret" },
          { status: 401 }
        );
      }
    }

    console.log("[API Cron] Received platform stats sync trigger...");

    // Execute the sync across all users
    const result = await syncAllUsersStats({
      batchDelayMs: 150,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${result.totalAccountsProcessed} accounts across ${result.totalUsersScanned} users.`,
      result,
    });
  } catch (error: unknown) {
    console.error("[API Cron] Error during cron sync execution:", error);
    const message = error instanceof Error ? error.message : "Internal cron execution failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return handleCronRequest(req);
}

export async function POST(req: Request) {
  return handleCronRequest(req);
}
