import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRedisClient } from "@/lib/redis";

export const runtime = "nodejs";

interface FlatCommentRow {
  id: string;
  content: string;
  userId?: string | null;
  authorName?: string | null;
  avatarUrl?: string | null;
  createdAt: Date | string;
  parentId?: string | null;
  likesCount?: number | null;
  dislikesCount?: number | null;
}

interface TreeComment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
    isVerified: boolean;
  };
  createdAt: string;
  parentId?: string;
  likesCount: number;
  dislikesCount: number;
  replies: TreeComment[];
}

// Convert flat database comment rows into a nested tree
function buildCommentTree(flatComments: FlatCommentRow[]) {
  const commentMap = new Map<string, TreeComment>();
  const rootComments: TreeComment[] = [];

  for (const row of flatComments) {
    commentMap.set(row.id, {
      id: row.id,
      content: row.content,
      author: {
        id: row.userId || `guest-${row.id.slice(0, 6)}`,
        name: row.authorName || "Coder",
        avatarUrl: row.avatarUrl || undefined,
        isVerified: Boolean(row.userId),
      },
      createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : new Date(row.createdAt).toISOString(),
      parentId: row.parentId || undefined,
      likesCount: Math.max(0, row.likesCount || 0),
      dislikesCount: Math.max(0, row.dislikesCount || 0),
      replies: [],
    });
  }

  for (const row of flatComments) {
    const node = commentMap.get(row.id);
    if (!node) continue;
    if (row.parentId && commentMap.has(row.parentId)) {
      const parent = commentMap.get(row.parentId);
      if (parent) {
        parent.replies.push(node);
      } else {
        rootComments.push(node);
      }
    } else {
      rootComments.push(node);
    }
  }

  return rootComments;
}

// GET /api/discussions/[id]/comments
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const rows = await prisma.discussionComment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
    });

    const tree = buildCommentTree(rows || []);

    return NextResponse.json({
      success: true,
      comments: tree,
      totalCount: rows.length,
    });
  } catch (error: unknown) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST /api/discussions/[id]/comments
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;
    const body = await req.json();
    const {
      content,
      parentId = null,
      authorName = "Coder",
      authorHandle = null,
      avatarUrl = null,
      userId = null,
    } = body;

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment content cannot be empty" },
        { status: 400 }
      );
    }

    // Verify post exists
    const postExists = await prisma.discussionPost.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!postExists) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    let resolvedAuthorName = authorName ? String(authorName).trim() : "Coder";
    let resolvedAuthorHandle = authorHandle ? String(authorHandle).trim() : null;
    let resolvedAvatarUrl = avatarUrl ? String(avatarUrl).trim() : null;

    let validUserId: string | null = null;
    if (userId && typeof userId === "string" && userId.trim()) {
      const trimmedUserId = userId.trim();
      const dbUser = await prisma.user.upsert({
        where: { id: trimmedUserId },
        update: {
          ...(resolvedAuthorName ? { displayName: resolvedAuthorName } : {}),
          ...(resolvedAvatarUrl ? { photoUrl: resolvedAvatarUrl } : {}),
        },
        create: {
          id: trimmedUserId,
          displayName: resolvedAuthorName || "Coder",
          photoUrl: resolvedAvatarUrl,
          email: resolvedAuthorHandle && resolvedAuthorHandle.startsWith("@") ? `${resolvedAuthorHandle.slice(1)}@user.algoryn` : null,
        },
        select: { id: true, displayName: true, photoUrl: true, email: true },
      });

      validUserId = dbUser.id;
      if (dbUser.displayName) resolvedAuthorName = dbUser.displayName;
      if (dbUser.photoUrl) resolvedAvatarUrl = dbUser.photoUrl;
      if (!resolvedAuthorHandle && dbUser.email) {
        resolvedAuthorHandle = `@${dbUser.email.split("@")[0]}`;
      }
    }

    const created = await prisma.discussionComment.create({
      data: {
        postId,
        userId: validUserId,
        authorName: resolvedAuthorName,
        authorHandle: resolvedAuthorHandle,
        avatarUrl: resolvedAvatarUrl,
        content: content.trim(),
        parentId: parentId || null,
        likesCount: 0,
        dislikesCount: 0,
      },
    });

    const newCommentNode = {
      id: created.id,
      content: created.content,
      author: {
        id: created.userId || `guest-${created.id.slice(0, 6)}`,
        name: created.authorName,
        avatarUrl: created.avatarUrl || undefined,
        isVerified: Boolean(created.userId),
      },
      createdAt: created.createdAt.toISOString(),
      parentId: created.parentId || undefined,
      likesCount: 0,
      dislikesCount: 0,
      replies: [],
    };

    return NextResponse.json({
      success: true,
      comment: newCommentNode,
    });
  } catch (error: unknown) {
    console.error("Error creating comment:", error);
    const message = error instanceof Error ? error.message : "Failed to create comment";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// PATCH /api/discussions/[id]/comments - Upvote / Downvote or Edit comment content
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await context.params;
    const body = await req.json();
    const { commentId, action, content, userId } = body;

    if (!commentId) {
      return NextResponse.json({ error: "commentId is required" }, { status: 400 });
    }

    const comment = await prisma.discussionComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // 1. Edit comment content
    if (content !== undefined) {
      if (!userId || typeof userId !== "string" || !userId.trim()) {
        return NextResponse.json(
          { error: "Authentication required: Please sign in to edit comments" },
          { status: 401 }
        );
      }

      if (typeof content !== "string" || content.trim().length === 0) {
        return NextResponse.json(
          { error: "Comment content cannot be empty" },
          { status: 400 }
        );
      }

      if (content.length > 5000) {
        return NextResponse.json(
          { error: "Comment content exceeds the 5,000 character limit" },
          { status: 400 }
        );
      }

      const trimmedUserId = userId.trim();
      const user = await prisma.user.findUnique({
        where: { id: trimmedUserId },
        select: { id: true, displayName: true, email: true },
      });

      const isCommentAuthor = comment.userId ? comment.userId === trimmedUserId : (user?.displayName && user.displayName === comment.authorName);

      if (!isCommentAuthor) {
        return NextResponse.json(
          { error: "Unauthorized: You can only edit your own comments" },
          { status: 403 }
        );
      }

      const updated = await prisma.discussionComment.update({
        where: { id: commentId },
        data: {
          content: content.trim(),
        },
      });

      return NextResponse.json({
        success: true,
        comment: {
          id: updated.id,
          content: updated.content,
          updatedAt: updated.updatedAt.toISOString(),
        },
      });
    }

    // 2. Upvote / Downvote comment with per-user toggle logic
    if (action === "upvote" || action === "downvote") {
      const effectiveUserId = (userId && typeof userId === "string" && userId.trim()) || "anonymous-guest";
      const redis = getRedisClient();
      const voteCacheKey = `comment:vote:${commentId}:${effectiveUserId}`;

      let previousVote: "upvote" | "downvote" | null = null;
      if (redis) {
        try {
          previousVote = await redis.get<"upvote" | "downvote">(voteCacheKey);
        } catch {}
      }

      let newLikes = Math.max(0, comment.likesCount || 0);
      let newDislikes = Math.max(0, comment.dislikesCount || 0);
      let userVote: "upvote" | "downvote" | null = null;

      if (previousVote === action) {
        // User clicked same vote again: Toggle off!
        if (action === "upvote") newLikes = Math.max(0, newLikes - 1);
        if (action === "downvote") newDislikes = Math.max(0, newDislikes - 1);
        userVote = null;
        if (redis) {
          try { await redis.del(voteCacheKey); } catch {}
        }
      } else if (previousVote && previousVote !== action) {
        // User switched their vote!
        if (action === "upvote") {
          newLikes = newLikes + 1;
          newDislikes = Math.max(0, newDislikes - 1);
        } else {
          newDislikes = newDislikes + 1;
          newLikes = Math.max(0, newLikes - 1);
        }
        userVote = action;
        if (redis) {
          try { await redis.set(voteCacheKey, action, { ex: 86400 * 30 }); } catch {}
        }
      } else {
        // New vote!
        if (action === "upvote") newLikes = newLikes + 1;
        if (action === "downvote") newDislikes = newDislikes + 1;
        userVote = action;
        if (redis) {
          try { await redis.set(voteCacheKey, action, { ex: 86400 * 30 }); } catch {}
        }
      }

      const updated = await prisma.discussionComment.update({
        where: { id: commentId },
        data: {
          likesCount: newLikes,
          dislikesCount: newDislikes,
        },
      });

      return NextResponse.json({
        success: true,
        userVote,
        likesCount: updated.likesCount,
        dislikesCount: updated.dislikesCount,
      });
    }
  } catch (error: unknown) {
    console.error("Error updating comment:", error);
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
  }
}

// DELETE /api/discussions/[id]/comments - Delete comment (cascades nested replies)
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await context.params;
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("commentId");
    const userId = searchParams.get("userId");

    if (!commentId) {
      return NextResponse.json(
        { error: "commentId is required" },
        { status: 400 }
      );
    }

    if (!userId || !userId.trim()) {
      return NextResponse.json(
        { error: "Authentication required: Please sign in to delete comments" },
        { status: 401 }
      );
    }

    const comment = await prisma.discussionComment.findUnique({
      where: { id: commentId },
      include: {
        post: { select: { userId: true } },
      },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const trimmedUserId = userId.trim();
    const user = await prisma.user.findUnique({
      where: { id: trimmedUserId },
      select: { id: true, displayName: true, email: true },
    });

    // Authorized if:
    // 1. User is the author of the comment
    // 2. User is the author of the post (moderator of their post)
    const isCommentAuthor = comment.userId ? comment.userId === trimmedUserId : (user?.displayName && user.displayName === comment.authorName);
    const isPostAuthor = comment.post?.userId ? comment.post.userId === trimmedUserId : false;

    if (!isCommentAuthor && !isPostAuthor) {
      return NextResponse.json(
        { error: "Unauthorized: You can only delete your own comments or comments on your posts" },
        { status: 403 }
      );
    }

    await prisma.discussionComment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ success: true, message: "Comment deleted successfully" });
  } catch (error: unknown) {
    console.error("Error deleting comment:", error);
    const message = error instanceof Error ? error.message : "Failed to delete comment";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
