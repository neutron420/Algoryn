import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NotificationService } from "@/lib/services/notification.service";

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
      select: { id: true, likesCount: true, userId: true, title: true, category: true },
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

      // Trigger dynamic notification for post author
      try {
        if (post.userId && post.userId !== effectiveUserId) {
          let likerName = "A developer";
          if (effectiveUserId && !effectiveUserId.startsWith("anonymous")) {
            const liker = await prisma.user.findUnique({
              where: { id: effectiveUserId },
              select: { displayName: true },
            });
            if (liker?.displayName) likerName = liker.displayName;
          }

          const isInterviewExperience = post.category?.toLowerCase() === "interview experience";
          await NotificationService.notifyDiscussionLiked(
            post.userId,
            likerName,
            post.title || (isInterviewExperience ? "Interview Experience" : "Discussion"),
            postId,
            isInterviewExperience
          );
        }
      } catch (notifErr) {
        console.warn("[LikeAPI] Failed to trigger notification:", notifErr);
      }
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
