import { fetchLeetCodeStats } from "../lib/services/platform-fetchers/leetcode.fetcher";
import { fetchCodeforcesStats } from "../lib/services/platform-fetchers/codeforces.fetcher";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("=== Testing LeetCode for neutron420 ===");
  const lcResult = await fetchLeetCodeStats("neutron420");
  console.log("LeetCode Result:", JSON.stringify(lcResult, null, 2));

  console.log("\n=== Testing Codeforces for Coder-04Rit ===");
  const cfResult = await fetchCodeforcesStats("Coder-04Rit");
  console.log("Codeforces Result:", JSON.stringify(cfResult, null, 2));

  const accounts = await prisma.userPlatformAccount.findMany({
    where: { userId: "bhKYvqZR4RPLxf29dbVTEjMRv6V2" },
    include: { stats: true },
  });
  console.log("\n=== DB Platform Accounts for bhKYvqZR4RPLxf29dbVTEjMRv6V2 ===");
  console.log(JSON.stringify(accounts, null, 2));
}

main().catch(console.error);
