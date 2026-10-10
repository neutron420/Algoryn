# Algoryn Platform Stats Cron Service

Automated background synchronization engine that periodically retrieves competitive programming and coding platform statistics (LeetCode, Codeforces, CodeChef, GeeksforGeeks, AtCoder, HackerRank) for all users and updates the global leaderboard.

---

## Architecture Overview

- **`cron/sync-engine.ts`**: Core synchronization logic. Queries registered users and linked handles from PostgreSQL, fetches real-time platform statistics via upstream APIs, creates historical snapshots in `UserPlatformStats`, and recalculates global leaderboard scores and rankings.
- **`cron/sync-profiles.cron.ts`**: Dedicated cron runner executing on a 1-minute interval (`* * * * *`) via `node-cron`. Includes mutex locking to prevent overlapping executions and supports graceful process shutdown.
- **`app/api/cron/sync-profiles/route.ts`**: HTTP API endpoint (`GET` / `POST` `/api/cron/sync-profiles`) for external schedulers, webhooks, or cloud cron jobs.
- **`instrumentation.ts`**: Auto-initializes the cron runner inside the Next.js server runtime when the application boots, keeping profile stats fresh at all times.

---

## Usage

### 1. Continuous Background Execution (1-minute interval)
```bash
bun run cron
```

### 2. Single One-Time Execution
```bash
bun run cron:once
```

### 3. HTTP Trigger
```bash
curl http://localhost:3000/api/cron/sync-profiles
```

With `CRON_SECRET` enabled:
```bash
curl -H "Authorization: Bearer <CRON_SECRET>" http://localhost:3000/api/cron/sync-profiles
```

---

## Configuration

| Environment Variable | Description | Default |
| :--- | :--- | :--- |
| `CRON_SCHEDULE` | 5-field cron expression | `* * * * *` (Every 1 minute) |
| `CRON_SECRET` | Secret token to authenticate HTTP triggers | None (Unrestricted in dev) |
| `DATABASE_URL` | PostgreSQL connection string | Sourced from `.env` |
