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
    const { content, category, imageUrl, userId } = body;

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const post = await prisma.discussionPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check ownership if post has a userId
    if (post.userId && userId && post.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to edit this post" },
        { status: 403 }
      );
    }

    const updated = await prisma.discussionPost.update({
      where: { id: postId },
      data: {
        content: content !== undefined ? String(content).trim() : post.content,
        category: category !== undefined ? String(category) : post.category,
        imageUrl: imageUrl !== undefined ? (imageUrl ? String(imageUrl).trim() : null) : post.imageUrl,
      },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    console.error("Error updating discussion post:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update post" },
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

    const post = await prisma.discussionPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check ownership if post has a userId
    if (post.userId && userId && post.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to delete this post" },
        { status: 403 }
      );
    }

    // Delete the post (PostgreSQL schema cascades comments, likes, bookmarks automatically)
    await prisma.discussionPost.delete({
      where: { id: postId },
    });

    return NextResponse.json({ success: true, message: "Post deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting discussion post:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete post" },
      { status: 500 }
    );
  }
}
