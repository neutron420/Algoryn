import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

// Reloaded with updated LeaderboardEntry.user relation
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env["DATABASE_URL"];

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set.");
  }

  // Strip query parameters that cause node-postgres / SSL channel binding issues on Neon pooler
  const cleanUrl = databaseUrl
    .replace(/[?&]channel_binding=[^&]*/gi, "")
    .replace(/[?&]sslmode=[^&]*/gi, "");

  const pool =
    globalForPrisma.pool ??
    new Pool({
      connectionString: cleanUrl,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

  pool.on("error", (err) => {
    // Suppress unhandled background idle connection resets from Neon serverless timeout
    console.warn("Prisma PG pool idle connection reset handled:", err.message);
  });

  if (process.env["NODE_ENV"] !== "production") {
    globalForPrisma.pool = pool;
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env["NODE_ENV"] !== "production") {
  globalForPrisma.prisma = prisma;
}
