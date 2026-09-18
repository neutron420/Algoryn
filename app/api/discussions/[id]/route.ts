import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// PATCH /api/discussions/[id] - Edit post
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;
    const body = await req.json();
    const { title, content, category, imageUrl, tags, userId } = body;

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    if (!userId || typeof userId !== "string" || !userId.trim()) {
      return NextResponse.json(
        { error: "Authentication required: Please sign in to edit posts" },
        { status: 401 }
      );
    }

    const post = await prisma.discussionPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Verify user exists in database
    const trimmedUserId = userId.trim();
    const user = await prisma.user.findUnique({
      where: { id: trimmedUserId },
      select: { id: true, displayName: true, email: true },
    });

    const isPostOwner = post.userId ? post.userId === trimmedUserId : (user?.displayName && user.displayName === post.authorName);

    if (!isPostOwner) {
      return NextResponse.json(
        { error: "Unauthorized: You can only edit your own posts" },
        { status: 403 }
      );
    }

    if (content !== undefined) {
      if (typeof content !== "string" || content.trim().length === 0) {
        return NextResponse.json(
          { error: "Post content cannot be empty" },
          { status: 400 }
        );
      }
      if (content.length > 50000) {
        return NextResponse.json(
          { error: "Post content exceeds the 50,000 character limit" },
          { status: 400 }
        );
      }
    }

    if (title !== undefined && title !== null) {
      if (typeof title === "string" && title.length > 300) {
        return NextResponse.json(
          { error: "Post title cannot exceed 300 characters" },
          { status: 400 }
        );
      }
    }

    // Sanitize and limit tags
    let cleanedTags: string[] | undefined = undefined;
    if (tags !== undefined) {
      const rawTags = Array.isArray(tags)
        ? tags
        : typeof tags === "string"
        ? tags.split(",")
        : [];
      cleanedTags = rawTags
        .map((t: string) => String(t).replace(/^#/, "").trim())
        .filter((t: string) => t.length > 0 && t.length <= 30)
        .slice(0, 10);
    }

    // Validate image URL / imageUrls if provided (support up to 10 images)
    let safeImageUrl: string | null | undefined = undefined;
    if (body.imageUrls !== undefined) {
      if (Array.isArray(body.imageUrls)) {
        const valid = body.imageUrls
          .filter((u: unknown): u is string => typeof u === "string" && (u.startsWith("http://") || u.startsWith("https://")))
          .slice(0, 10);
        safeImageUrl = valid.length === 0 ? null : valid.length === 1 ? valid[0] : JSON.stringify(valid);
      } else {
        safeImageUrl = null;
      }
    } else if (imageUrl !== undefined) {
      if (imageUrl && typeof imageUrl === "string" && imageUrl.trim()) {
        const trimmed = imageUrl.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          safeImageUrl = trimmed;
        } else if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
          safeImageUrl = trimmed;
        } else {
          return NextResponse.json({ error: "Invalid image URL format" }, { status: 400 });
        }
      } else {
        safeImageUrl = null;
      }
    }

    const updated = await prisma.discussionPost.update({
      where: { id: postId },
      data: {
        title: title !== undefined ? (title ? String(title).trim() : null) : post.title,
        content: content !== undefined ? String(content).trim() : post.content,
        category: category !== undefined ? String(category).trim().slice(0, 50) : post.category,
        imageUrl: safeImageUrl !== undefined ? safeImageUrl : post.imageUrl,
        tags: cleanedTags !== undefined ? cleanedTags : post.tags,
      },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error: unknown) {
    console.error("Error updating discussion post:", error);
    const message = error instanceof Error ? error.message : "Failed to update post";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// DELETE /api/discussions/[id] - Delete post
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await context.params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    if (!userId || !userId.trim()) {
      return NextResponse.json(
        { error: "Authentication required: Please sign in to delete posts" },
        { status: 401 }
      );
    }

    const post = await prisma.discussionPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const trimmedUserId = userId.trim();
    const user = await prisma.user.findUnique({
      where: { id: trimmedUserId },
      select: { id: true, displayName: true, email: true },
    });

    const isPostOwner = post.userId ? post.userId === trimmedUserId : (user?.displayName && user.displayName === post.authorName);

    if (!isPostOwner) {
      return NextResponse.json(
        { error: "Unauthorized: You can only delete your own posts" },
        { status: 403 }
      );
    }

    // Delete the post (PostgreSQL schema cascades comments, likes, bookmarks automatically)
    await prisma.discussionPost.delete({
      where: { id: postId },
    });

    return NextResponse.json({ success: true, message: "Post deleted successfully" });
  } catch (error: unknown) {
    console.error("Error deleting discussion post:", error);
    const message = error instanceof Error ? error.message : "Failed to delete post";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
