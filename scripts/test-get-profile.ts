async function main() {
  const res = await fetch("http://localhost:3000/api/user/profile?userId=bhKYvqZR4RPLxf29dbVTEjMRv6V2");
  const data = await res.json();
  console.log("SUCCESS:", data.success);
  console.log("PLATFORM ACCOUNTS in GET /api/user/profile:", JSON.stringify(data.platformAccounts, null, 2));
  console.log("STATS in GET /api/user/profile:", JSON.stringify(data.stats, null, 2));
}

main().catch(console.error);
