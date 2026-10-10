export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // If running in long-lived Node.js/Bun server (local development, Docker, VPS),
    // automatically boot the background cron scheduler.
    // On Vercel serverless, cron jobs are handled by vercel.json pings to /api/cron/sync-profiles.
    if (!process.env.VERCEL) {
      const { startCronJob } = await import("./cron/sync-profiles.cron");
      startCronJob();
    }
  }
}
