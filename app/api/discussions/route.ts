import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const sort = searchParams.get("sort") || "latest";
    const currentUserId = searchParams.get("userId");
    const limit = Math.min(Number(searchParams.get("limit")) || 40, 100);

    const whereClause: Record<string, unknown> = {};
    if (category && category !== "ALL" && category !== "All posts") {
      whereClause["category"] = { equals: category, mode: "insensitive" };
    }
    if (tag && tag.trim().length > 0) {
      whereClause["tags"] = { has: tag.trim() };
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
        _count: {
          select: { comments: true },
        },
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

    const formattedPosts = posts.map((post) => {
      let parsedImages: string[] = [];
      if (post.imageUrl) {
        const trimmed = post.imageUrl.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          try {
            const arr = JSON.parse(trimmed);
            if (Array.isArray(arr)) {
              parsedImages = arr.filter((u: unknown): u is string => typeof u === "string" && Boolean(u.trim()));
            }
          } catch {
            parsedImages = [trimmed];
          }
        } else {
          parsedImages = [trimmed];
        }
      }

      return {
        id: post.id,
        userId: post.userId,
        authorName: post.authorName,
        authorHandle: post.authorHandle || `@${post.authorName.toLowerCase().replace(/\s+/g, "")}`,
        authorRole: post.authorRole || "Software Engineer",
        avatarUrl: post.avatarUrl,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        imageUrls: parsedImages,
        category: post.category,
        tags: post.tags || [],
        viewsCount: post.viewsCount || 0,
        likesCount: post.likesCount || 0,
        bookmarksCount: post.bookmarksCount || 0,
        commentsCount: post._count?.comments || 0,
        createdAt: post.createdAt,
        isLiked: (post.likes?.length ?? 0) > 0,
        isBookmarked: (post.bookmarks?.length ?? 0) > 0,
      };
    });

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
      title,
      content,
      category = "General",
      tags = [],
      imageUrl,
      userId,
      authorName,
      authorHandle,
      authorRole = "Software Engineer",
      avatarUrl,
    } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
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

    if (title && typeof title === "string" && title.length > 300) {
      return NextResponse.json(
        { error: "Post title cannot exceed 300 characters" },
        { status: 400 }
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

    if (!resolvedAuthorHandle) {
      resolvedAuthorHandle = `@${resolvedAuthorName.toLowerCase().replace(/\s+/g, "")}`;
    }

    // Process and limit tags array
    const rawTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",")
      : [];
    const cleanedTags: string[] = rawTags
      .map((t: string) => String(t).replace(/^#/, "").trim())
      .filter((t: string) => t.length > 0 && t.length <= 30)
      .slice(0, 10);

    // Validate image URLs (support up to 10 pictures per post)
    let safeImageUrl: string | null = null;
    if (Array.isArray(body.imageUrls) && body.imageUrls.length > 0) {
      const valid = body.imageUrls
        .filter((u: unknown): u is string => typeof u === "string" && (u.startsWith("http://") || u.startsWith("https://")))
        .slice(0, 10);
      safeImageUrl = valid.length === 0 ? null : valid.length === 1 ? valid[0] : JSON.stringify(valid);
    } else if (imageUrl && typeof imageUrl === "string" && imageUrl.trim()) {
      const trimmed = imageUrl.trim();
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        safeImageUrl = trimmed;
      } else if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        safeImageUrl = trimmed;
      }
    }

    const newPost = await prisma.discussionPost.create({
      data: {
        userId: validUserId,
        authorName: resolvedAuthorName,
        authorHandle: resolvedAuthorHandle,
        authorRole: authorRole ? String(authorRole).trim().slice(0, 50) : "Software Engineer",
        avatarUrl: resolvedAvatarUrl,
        title: title ? String(title).trim() : null,
        content: content.trim(),
        imageUrl: safeImageUrl,
        category: category ? String(category).trim().slice(0, 50) : "General",
        tags: cleanedTags,
        viewsCount: 1,
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
