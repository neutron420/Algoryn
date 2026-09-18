import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Convert flat database comment rows into a nested tree matching @hasthiya_/headless-comments-react
function buildCommentTree(flatComments: any[]) {
  const commentMap = new Map<string, any>();
  const rootComments: any[] = [];

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
      reactions: [
        {
          id: "like",
          label: "Like",
          emoji: "👍",
          count: Math.max(0, row.likesCount || 0),
          isActive: false,
        },
      ],
      replies: [],
    });
  }

  for (const row of flatComments) {
    const node = commentMap.get(row.id);
    if (row.parentId && commentMap.has(row.parentId)) {
      commentMap.get(row.parentId).replies.push(node);
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
  } catch (error: any) {
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

    if (userId && typeof userId === "string") {
      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { displayName: true, photoUrl: true, email: true },
      });
      if (dbUser) {
        if (dbUser.displayName) resolvedAuthorName = dbUser.displayName;
        if (dbUser.photoUrl) resolvedAvatarUrl = dbUser.photoUrl;
        if (!resolvedAuthorHandle && dbUser.email) {
          resolvedAuthorHandle = `@${dbUser.email.split("@")[0]}`;
        }
      }
    }

    const created = await prisma.discussionComment.create({
      data: {
        postId,
        userId: userId || null,
        authorName: resolvedAuthorName,
        authorHandle: resolvedAuthorHandle,
        avatarUrl: resolvedAvatarUrl,
        content: content.trim(),
        parentId: parentId || null,
        likesCount: 0,
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
      reactions: [
        { id: "like", label: "Like", emoji: "👍", count: 0, isActive: false },
      ],
      replies: [],
    };

    return NextResponse.json({
      success: true,
      comment: newCommentNode,
    });
  } catch (error: any) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create comment" },
      { status: 500 }
    );
  }
}

// DELETE /api/discussions/[id]/comments
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { error: "commentId is required" },
        { status: 400 }
      );
    }

    // Prisma cascade on parent relation deletes replies automatically
    await prisma.discussionComment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ success: true, message: "Comment deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete comment" },
      { status: 500 }
    );
  }
}
