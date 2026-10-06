import { CodingPlatform } from "../app/generated/prisma/client";
import { syncUserPlatform } from "../lib/services/platform-sync.service";
import { prisma } from "../lib/prisma";

async function main() {
  const userId = "bhKYvqZR4RPLxf29dbVTEjMRv6V2";

  console.log("=== Syncing LeetCode for neutron420 ===");
  const lcSync = await syncUserPlatform(userId, CodingPlatform.LEETCODE, "neutron420");
  console.log("LeetCode Sync result:", JSON.stringify(lcSync, null, 2));

  console.log("\n=== Syncing Codeforces for Coder-04Rit ===");
  const cfSync = await syncUserPlatform(userId, CodingPlatform.CODEFORCES, "Coder-04Rit");
  console.log("Codeforces Sync result:", JSON.stringify(cfSync, null, 2));

  console.log("\n=== Checking DB after sync ===");
  const accounts = await prisma.userPlatformAccount.findMany({
    where: { userId },
    include: { stats: true },
  });
  console.log("DB accounts count:", accounts.length);
  for (const a of accounts) {
    console.log(a.platform, a.username, "Stats count:", a.stats.length, "Latest stat:", a.stats[0]);
  }
}

main().catch(console.error);
