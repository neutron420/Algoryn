import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;
    const body = await req.json().catch(() => ({}));
    const { userId } = body;

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const post = await prisma.discussionPost.findUnique({
      where: { id: postId },
      select: { id: true, bookmarksCount: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const effectiveUserId = userId || "anonymous-guest";

    const existingBookmark = await prisma.discussionBookmark.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: effectiveUserId,
        },
      },
    });

    let bookmarked = false;
    let newBookmarksCount = post.bookmarksCount;

    if (existingBookmark) {
      // Remove bookmark
      await prisma.$transaction([
        prisma.discussionBookmark.delete({
          where: { id: existingBookmark.id },
        }),
        prisma.discussionPost.update({
          where: { id: postId },
          data: { bookmarksCount: { decrement: 1 } },
        }),
      ]);
      bookmarked = false;
      newBookmarksCount = Math.max(0, post.bookmarksCount - 1);
    } else {
      // Add bookmark
      await prisma.$transaction([
        prisma.discussionBookmark.create({
          data: {
            postId,
            userId: effectiveUserId,
          },
        }),
        prisma.discussionPost.update({
          where: { id: postId },
          data: { bookmarksCount: { increment: 1 } },
        }),
      ]);
      bookmarked = true;
      newBookmarksCount = post.bookmarksCount + 1;
    }

    return NextResponse.json({
      success: true,
      bookmarked,
      bookmarksCount: newBookmarksCount,
    });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return NextResponse.json({ error: "Failed to toggle bookmark" }, { status: 500 });
  }
}
