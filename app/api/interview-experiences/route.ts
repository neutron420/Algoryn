import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const company = searchParams.get("company");
    const round = searchParams.get("round");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "latest";
    const currentUserId = searchParams.get("userId");
    const bookmarkedOnly = searchParams.get("bookmarked") === "true";
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

    const andConditions: Record<string, unknown>[] = [
      { category: { equals: "Interview Experience", mode: "insensitive" } },
    ];

    if (company && company !== "ALL" && company !== "All Companies") {
      andConditions.push({
        OR: [
          { tags: { has: `company:${company}` } },
          { tags: { has: `company:${company.toLowerCase()}` } },
          { tags: { has: company } },
        ],
      });
    }

    if (round && round !== "ALL" && round !== "All Rounds") {
      andConditions.push({
        OR: [
          { tags: { has: `round:${round}` } },
          { tags: { has: round } },
        ],
      });
    }

    if (search && search.trim().length > 0) {
      const q = search.trim();
      andConditions.push({
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
          { authorRole: { contains: q, mode: "insensitive" } },
          { tags: { has: q } },
        ],
      });
    }

    if (bookmarkedOnly && currentUserId) {
      andConditions.push({
        bookmarks: {
          some: { userId: currentUserId },
        },
      });
    }

    const orderByClause =
      sort === "popular"
        ? [{ likesCount: "desc" as const }, { createdAt: "desc" as const }]
        : sort === "most-commented" || sort === "comments"
        ? [{ bookmarksCount: "desc" as const }, { likesCount: "desc" as const }, { createdAt: "desc" as const }]
        : [{ createdAt: "desc" as const }];

    const [posts, trendingPosts] = await Promise.all([
      prisma.discussionPost.findMany({
        where: { AND: andConditions },
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
      }),
      // Dynamic Top Read / Trending interview experiences
      prisma.discussionPost.findMany({
        where: { category: { equals: "Interview Experience", mode: "insensitive" } },
        orderBy: [
          { viewsCount: "desc" },
          { likesCount: "desc" },
          { createdAt: "desc" },
        ],
        take: 6,
        select: {
          id: true,
          title: true,
          content: true,
          tags: true,
          likesCount: true,
          viewsCount: true,
          createdAt: true,
          authorName: true,
          authorRole: true,
          _count: {
            select: { comments: true },
          },
        },
      }),
    ]);

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

      let companyName = "General";
      let roundType = "Full Loop";
      let verdict = "Offer";
      let role = post.authorRole || "Software Engineer";
      const userTags: string[] = [];

      for (const t of post.tags || []) {
        if (t.startsWith("company:")) companyName = t.replace("company:", "");
        else if (t.startsWith("round:")) roundType = t.replace("round:", "");
        else if (t.startsWith("verdict:")) verdict = t.replace("verdict:", "");
        else if (t.startsWith("role:")) role = t.replace("role:", "");
        else userTags.push(t);
      }

      return {
        id: post.id,
        userId: post.userId,
        authorName: post.authorName,
        authorHandle: post.authorHandle || `@${post.authorName.toLowerCase().replace(/\s+/g, "")}`,
        authorRole: role,
        avatarUrl: post.avatarUrl,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        imageUrls: parsedImages,
        category: post.category,
        company: companyName,
        round: roundType,
        verdict,
        tags: userTags,
        viewsCount: post.viewsCount || 0,
        likesCount: post.likesCount || 0,
        bookmarksCount: post.bookmarksCount || 0,
        commentsCount: post._count?.comments || 0,
        createdAt: post.createdAt.toISOString(),
        isLiked: (post.likes?.length ?? 0) > 0,
        isBookmarked: (post.bookmarks?.length ?? 0) > 0,
      };
    });

    const formattedTrending = trendingPosts.map((post) => {
      let companyName = "General";
      let roundType = "Full Loop";
      let role = post.authorRole || "Software Engineer";
      for (const t of post.tags || []) {
        if (t.startsWith("company:")) companyName = t.replace("company:", "");
        else if (t.startsWith("round:")) roundType = t.replace("round:", "");
        else if (t.startsWith("role:")) role = t.replace("role:", "");
      }
      return {
        id: post.id,
        title: post.title,
        company: companyName,
        round: roundType,
        role,
        likes: post.likesCount || 0,
        views: post.viewsCount || 0,
        comments: post._count.comments || 0,
        createdAt: post.createdAt.toISOString(),
        authorName: post.authorName,
      };
    });

    return NextResponse.json({
      success: true,
      experiences: formattedPosts,
      trending: formattedTrending,
    });
  } catch (error) {
    console.error("Error fetching interview experiences:", error);
    return NextResponse.json({ error: "Failed to fetch interview experiences" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      company = "Google",
      round = "Round 1 - Technical",
      verdict = "Offer",
      role = "Software Engineer",
      title,
      content,
      imageUrls = [],
      tags = [],
      userId = null,
      authorName = "Coder",
      authorHandle = null,
      avatarUrl = null,
    } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    let validUserId: string | null = null;
    let resolvedAuthorName = authorName ? String(authorName).trim() : "Coder";
    let resolvedAuthorHandle = authorHandle ? String(authorHandle).trim() : null;
    let resolvedAvatarUrl = avatarUrl ? String(avatarUrl).trim() : null;

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
          displayName: resolvedAuthorName,
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

    // Sanitize and attach structured tags
    const cleanedCustomTags = Array.isArray(tags)
      ? tags.map((t: string) => String(t).replace(/^#/, "").trim()).filter(Boolean).slice(0, 10)
      : [];

    const structuredTags = [
      `company:${String(company).trim()}`,
      `round:${String(round).trim()}`,
      `verdict:${String(verdict).trim()}`,
      `role:${String(role).trim()}`,
      ...cleanedCustomTags,
    ];

    let safeImageUrl: string | null = null;
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      const valid = imageUrls
        .filter((u: unknown): u is string => typeof u === "string" && (u.startsWith("http://") || u.startsWith("https://")))
        .slice(0, 10);
      safeImageUrl = valid.length === 0 ? null : valid.length === 1 ? valid[0] : JSON.stringify(valid);
    }

    const created = await prisma.discussionPost.create({
      data: {
        userId: validUserId,
        authorName: resolvedAuthorName,
        authorHandle: resolvedAuthorHandle,
        authorRole: role ? String(role).trim().slice(0, 60) : "Software Engineer",
        avatarUrl: resolvedAvatarUrl,
        title: title.trim().slice(0, 300),
        content: content.trim(),
        imageUrl: safeImageUrl,
        category: "Interview Experience",
        tags: structuredTags,
        viewsCount: 0,
        likesCount: 0,
        bookmarksCount: 0,
      },
    });

    return NextResponse.json({
      success: true,
      experience: {
        id: created.id,
        userId: created.userId,
        authorName: created.authorName,
        authorHandle: created.authorHandle,
        authorRole: created.authorRole,
        avatarUrl: created.avatarUrl,
        title: created.title,
        content: created.content,
        company,
        round,
        verdict,
        tags: cleanedCustomTags,
        viewsCount: 0,
        likesCount: 0,
        bookmarksCount: 0,
        commentsCount: 0,
        createdAt: created.createdAt.toISOString(),
        isLiked: false,
        isBookmarked: false,
      },
    });
  } catch (error) {
    console.error("Error creating interview experience:", error);
    return NextResponse.json({ error: "Failed to create interview experience" }, { status: 500 });
  }
}
