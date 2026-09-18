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
      select: { id: true, likesCount: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const effectiveUserId = userId || "anonymous-guest";

    const existingLike = await prisma.discussionLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: effectiveUserId,
        },
      },
    });

    let liked = false;
    let newLikesCount = post.likesCount;

    if (existingLike) {
      // Unlike - explicitly clamp so likesCount NEVER drops below 0
      const safeLikesCount = Math.max(0, post.likesCount - 1);
      await prisma.$transaction([
        prisma.discussionLike.delete({
          where: { id: existingLike.id },
        }),
        prisma.discussionPost.update({
          where: { id: postId },
          data: { likesCount: safeLikesCount },
        }),
      ]);
      liked = false;
      newLikesCount = safeLikesCount;
    } else {
      // Like
      await prisma.$transaction([
        prisma.discussionLike.create({
          data: {
            postId,
            userId: effectiveUserId,
          },
        }),
        prisma.discussionPost.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } },
        }),
      ]);
      liked = true;
      newLikesCount = post.likesCount + 1;
    }

    return NextResponse.json({
      success: true,
      liked,
      likesCount: newLikesCount,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}
