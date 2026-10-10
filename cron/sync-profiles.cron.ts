import cron, { type ScheduledTask } from "node-cron";
import { syncAllUsersStats } from "./sync-engine";

const DEFAULT_CRON_SCHEDULE = "* * * * *";
const cronSchedule = process.env.CRON_SCHEDULE || DEFAULT_CRON_SCHEDULE;

const isRunOnce = process.argv.includes("--once");
const isRunImmediately = process.argv.includes("--now") || !isRunOnce;

let isJobRunning = false;
let executionCount = 0;
let cronTask: ScheduledTask | null = null;

function printBanner() {
  console.log(`------------------------------------------------------------------------`);
  console.log(`[CRON_RUNNER] Algoryn Platform Stats Sync Service`);
  console.log(`[CRON_RUNNER] Schedule: ${cronSchedule} (Every 1 minute)`);
  console.log(`[CRON_RUNNER] Target: All registered user profiles`);
  console.log(`[CRON_RUNNER] Mutex Lock: Enabled`);
  console.log(`------------------------------------------------------------------------`);
}

async function runSyncIteration() {
  if (isJobRunning) {
    console.warn(`[CRON_RUNNER] [WARN] Previous sync iteration is still active. Skipping concurrent run.`);
    return;
  }

  isJobRunning = true;
  executionCount++;

  const timestamp = new Date().toISOString();
  console.log(`[CRON_RUNNER] [${timestamp}] [INFO] Starting sync iteration #${executionCount}`);

  try {
    const result = await syncAllUsersStats({
      batchDelayMs: 250,
    });

    console.log(
      `[CRON_RUNNER] [${new Date().toISOString()}] [INFO] Iteration #${executionCount} completed | Duration: ${(result.durationMs / 1000).toFixed(1)}s | Processed: ${result.totalAccountsProcessed} | Success: ${result.successCount} | Errors: ${result.errorCount}`
    );
  } catch (error) {
    console.error(`[CRON_RUNNER] [ERROR] Unhandled exception in iteration #${executionCount}:`, error);
  } finally {
    isJobRunning = false;
  }
}

export function startCronJob() {
  if (cronTask) {
    return cronTask;
  }

  printBanner();

  if (isRunOnce) {
    console.log(`[CRON_RUNNER] [INFO] Executing single run (--once mode)`);
    runSyncIteration().then(() => {
      console.log(`[CRON_RUNNER] [INFO] Execution finished. Exiting process.`);
      process.exit(0);
    });
    return null;
  }

  if (!cron.validate(cronSchedule)) {
    console.error(`[CRON_RUNNER] [ERROR] Invalid cron schedule expression: "${cronSchedule}"`);
    process.exit(1);
  }

  cronTask = cron.schedule(cronSchedule, () => {
    runSyncIteration();
  });

  console.log(`[CRON_RUNNER] [INFO] Cron daemon active. Listening on schedule: "${cronSchedule}"`);

  if (isRunImmediately) {
    runSyncIteration();
  }

  const handleExit = (signal: string) => {
    console.log(`\n[CRON_RUNNER] [INFO] Caught ${signal}. Stopping scheduler.`);
    stopCronJob();
    process.exit(0);
  };

  process.on("SIGINT", () => handleExit("SIGINT"));
  process.on("SIGTERM", () => handleExit("SIGTERM"));

  return cronTask;
}

export function stopCronJob() {
  if (cronTask) {
    cronTask.stop();
    cronTask = null;
    console.log(`[CRON_RUNNER] [INFO] Cron scheduler stopped.`);
  }
}

const isDirectExecution = Boolean(
  (import.meta as { main?: boolean }).main ||
    process.argv[1]?.includes("sync-profiles.cron")
);

if (isDirectExecution) {
  startCronJob();
}
