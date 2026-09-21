import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRedisClient } from "@/lib/redis";

export const runtime = "nodejs";

const memoryPostViews = new Set<string>();

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const viewerId =
      (body.userId && typeof body.userId === "string" && body.userId.trim()) ||
      (body.viewerId && typeof body.viewerId === "string" && body.viewerId.trim()) ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "anonymous-guest";

    const viewCacheKey = `post:view:${postId}:${viewerId}`;
    const redis = getRedisClient();

    let alreadyViewed = false;
    if (redis) {
      try {
        // Set if not exists with 1 year expiration
        const setResult = await redis.set(viewCacheKey, "1", { nx: true, ex: 86400 * 365 });
        if (!setResult) {
          alreadyViewed = true;
        }
      } catch (redisErr) {
        console.warn("[Redis] Failed checking view cache key:", redisErr);
      }
    } else {
      if (memoryPostViews.has(viewCacheKey)) {
        alreadyViewed = true;
      } else {
        memoryPostViews.add(viewCacheKey);
      }
    }

    if (alreadyViewed) {
      // Don't increment again for this person's ID!
      const post = await prisma.discussionPost.findUnique({
        where: { id: postId },
        select: { viewsCount: true },
      });
      return NextResponse.json({
        success: true,
        viewsCount: post?.viewsCount || 0,
        alreadyViewed: true,
      });
    }

    // New unique view from this person: increment by 1
    const updated = await prisma.discussionPost.update({
      where: { id: postId },
      data: {
        viewsCount: { increment: 1 },
      },
      select: { id: true, viewsCount: true },
    });

    return NextResponse.json({
      success: true,
      viewsCount: updated.viewsCount,
      alreadyViewed: false,
    });
  } catch (error) {
    console.error("Error incrementing post view count:", error);
    return NextResponse.json({ error: "Failed to increment views" }, { status: 500 });
  }
}
