import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "latest";
    const currentUserId = searchParams.get("userId");
    const limit = Math.min(Number(searchParams.get("limit")) || 30, 60);

    const whereClause: Record<string, unknown> = {};
    if (category && category !== "ALL") {
      whereClause["category"] = { equals: category, mode: "insensitive" };
    }

    const orderByClause =
      sort === "popular"
        ? [{ likesCount: "desc" as const }, { createdAt: "desc" as const }]
        : sort === "most-commented" || sort === "comments"
        ? [{ bookmarksCount: "desc" as const }, { likesCount: "desc" as const }, { createdAt: "desc" as const }]
        : [{ createdAt: "desc" as const }];

    const posts = await prisma.discussionPost.findMany({
      where: whereClause,
      orderBy: orderByClause,
      take: limit,
      include: {
        likes: currentUserId
          ? {
              where: { userId: currentUserId },
              select: { id: true },
            }
          : false,
        bookmarks: currentUserId
          ? {
              where: { userId: currentUserId },
              select: { id: true },
            }
          : false,
      },
    });

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      userId: post.userId,
      authorName: post.authorName,
      authorHandle: post.authorHandle || `@${post.authorName.toLowerCase().replace(/\s+/g, "")}`,
      avatarUrl: post.avatarUrl,
      content: post.content,
      imageUrl: post.imageUrl,
      category: post.category,
      likesCount: post.likesCount,
      bookmarksCount: post.bookmarksCount,
      createdAt: post.createdAt,
      isLiked: (post.likes?.length ?? 0) > 0,
      isBookmarked: (post.bookmarks?.length ?? 0) > 0,
    }));

    return NextResponse.json({ success: true, posts: formattedPosts });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return NextResponse.json(
      { error: "Failed to fetch discussions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      content,
      category = "General",
      imageUrl,
      userId,
      authorName,
      authorHandle,
      avatarUrl,
    } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Post content cannot be empty" },
        { status: 400 }
      );
    }

    let resolvedAuthorName = authorName ? String(authorName).trim() : "Coder";
    let resolvedAuthorHandle = authorHandle ? String(authorHandle).trim() : null;
    let resolvedAvatarUrl = avatarUrl ? String(avatarUrl).trim() : null;

    // If userId provided, sync with User table if present
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

    if (!resolvedAuthorHandle) {
      resolvedAuthorHandle = `@${resolvedAuthorName.toLowerCase().replace(/\s+/g, "")}`;
    }

    const newPost = await prisma.discussionPost.create({
      data: {
        userId: userId || null,
        authorName: resolvedAuthorName,
        authorHandle: resolvedAuthorHandle,
        avatarUrl: resolvedAvatarUrl,
        content: content.trim(),
        imageUrl: imageUrl ? String(imageUrl).trim() : null,
        category: category || "General",
      },
    });

    return NextResponse.json(
      { success: true, post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating discussion post:", error);
    return NextResponse.json(
      { error: "Failed to create discussion post" },
      { status: 500 }
    );
  }
}
