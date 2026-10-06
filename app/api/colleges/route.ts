import { NextRequest, NextResponse } from "next/server";
import { INDIAN_COLLEGES } from "@/lib/profile-constants";
import fs from "fs";
import path from "path";

let allCollegesCache: string[] | null = null;

function getAllColleges(): string[] {
  if (allCollegesCache && allCollegesCache.length > 0) return allCollegesCache;
  try {
    const filePath = path.join(process.cwd(), "data", "all-indian-colleges.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        allCollegesCache = parsed;
        return allCollegesCache;
      }
    }
  } catch (err) {
    console.error("Error loading all-indian-colleges.json:", err);
  }
  allCollegesCache = INDIAN_COLLEGES;
  return allCollegesCache;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const limit = Math.min(Number(searchParams.get("limit")) || 30, 100);

    const fullDataset = getAllColleges();
    let results: string[] = [];

    if (!search) {
      results = fullDataset.slice(0, limit);
    } else {
      const searchTerms = search.split(/\s+/).filter(Boolean);
      results = fullDataset.filter((college) => {
        const lower = college.toLowerCase();
        return searchTerms.every((term) => lower.includes(term));
      }).slice(0, limit);

      // If fewer than 5 matches in the national 51k+ dataset, query Hipo Labs India Universities API as extra backup
      if (results.length < 5) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1200);

          const externalRes = await fetch(
            `http://universities.hipolabs.com/search?country=India&name=${encodeURIComponent(search)}`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          if (externalRes.ok) {
            const externalData: Array<{ name: string; "state-province"?: string }> = await externalRes.json();
            const externalNames = externalData.map((item) => {
              const state = item["state-province"] ? ` (${item["state-province"]})` : "";
              return `${item.name}${state}`;
            });

            const merged = Array.from(new Set([...results, ...externalNames]));
            results = merged.slice(0, limit);
          }
        } catch {
          // Graceful fallback to local results
        }
      }
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      colleges: results,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch colleges" },
      { status: 500 }
    );
  }
}
