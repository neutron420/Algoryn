import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CodingPlatform, Difficulty } from "@/app/generated/prisma/client";
import { invalidateCache } from "@/lib/redis";
import { NotificationService } from "@/lib/services/notification.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const companySlug = searchParams.get("companySlug");
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

    if (companySlug) {
      const company = await prisma.company.findFirst({
        where: { slug: { equals: companySlug.toLowerCase().trim(), mode: "insensitive" } },
      });

      if (!company) {
        return NextResponse.json(
          { error: `Company with slug '${companySlug}' not found` },
          { status: 404 }
        );
      }

      const submissions = await prisma.communityProblem.findMany({
        where: { companyId: company.id },
        orderBy: [{ upvotes: "desc" }, { createdAt: "desc" }],
        take: limit,
        include: {
          company: { select: { name: true, slug: true } },
          user: { select: { displayName: true, photoUrl: true } },
        },
      });

      return NextResponse.json({ success: true, submissions });
    }

    // Site-wide recent submissions
    const submissions = await prisma.communityProblem.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        company: { select: { name: true, slug: true } },
        user: { select: { displayName: true, photoUrl: true } },
      },
    });

    return NextResponse.json({ success: true, submissions });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      companySlug,
      platform = "LEETCODE",
      title,
      problemUrl,
      difficulty = "MEDIUM",
      roundType,
      interviewMonth,
      interviewYear,
      timeframe,
      topics = [],
      notes,
      userId,
      authorName,
      authorEmail,
    } = body;

    // Validation
    if (!companySlug || typeof companySlug !== "string") {
      return NextResponse.json(
        { error: "Missing required companySlug" },
        { status: 400 }
      );
    }

    if (!title || typeof title !== "string" || title.trim().length < 2) {
      return NextResponse.json(
        { error: "Problem title is required and must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (!roundType || typeof roundType !== "string" || roundType.trim().length === 0) {
      return NextResponse.json(
        { error: "Interview round type is required (e.g. 'Online Assessment (OA)', 'Technical Round 1')" },
        { status: 400 }
      );
    }

    // Validate platform enum
    const validPlatforms = Object.values(CodingPlatform);
    const normalizedPlatform = (platform.toUpperCase().trim() as CodingPlatform);
    if (!validPlatforms.includes(normalizedPlatform)) {
      return NextResponse.json(
        { error: `Invalid platform. Allowed values: ${validPlatforms.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate difficulty enum
    const validDifficulties = Object.values(Difficulty);
    const normalizedDifficulty = (difficulty.toUpperCase().trim() as Difficulty);
    if (!validDifficulties.includes(normalizedDifficulty)) {
      return NextResponse.json(
        { error: `Invalid difficulty. Allowed values: ${validDifficulties.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate topics array
    const topicList = Array.isArray(topics)
      ? topics.map((t) => String(t).trim()).filter(Boolean)
      : [];

    if (topicList.length === 0) {
      return NextResponse.json(
        { error: "At least one topic tag is required (e.g. 'BFS', 'Dynamic Programming')" },
        { status: 400 }
      );
    }

    // Security validation: Validate problemUrl if provided
    let sanitizedProblemUrl: string | null = null;
    if (problemUrl && typeof problemUrl === "string" && problemUrl.trim()) {
      let fullUrl = problemUrl.trim();
      if (!/^https?:\/\//i.test(fullUrl)) {
        fullUrl = "https://" + fullUrl;
      }
      try {
        const parsed = new URL(fullUrl);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          return NextResponse.json(
            { error: "Invalid URL protocol. Only http and https URLs are accepted." },
            { status: 400 }
          );
        }
        const host = parsed.hostname.toLowerCase();
        if (
          host === "localhost" ||
          /^(\d{1,3}\.){3}\d{1,3}$/.test(host) ||
          host.endsWith(".local") ||
          host.endsWith(".internal")
        ) {
          return NextResponse.json(
            { error: "Private or internal network URLs are not permitted." },
            { status: 400 }
          );
        }
        sanitizedProblemUrl = parsed.toString();
      } catch {
        return NextResponse.json(
          { error: "Malformed problem link. Please enter a valid URL." },
          { status: 400 }
        );
      }
    }

    // Find the company
    const company = await prisma.company.findFirst({
      where: { slug: { equals: companySlug.toLowerCase().trim(), mode: "insensitive" } },
    });

    if (!company) {
      return NextResponse.json(
        { error: `Company with slug '${companySlug}' not found` },
        { status: 404 }
      );
    }

    // If userId provided, ensure user row exists
    if (userId && typeof userId === "string") {
      await prisma.user.upsert({
        where: { id: userId },
        update: {
          ...(authorName ? { displayName: authorName } : {}),
          ...(authorEmail ? { email: authorEmail } : {}),
        },
        create: {
          id: userId,
          displayName: authorName || null,
          email: authorEmail || null,
        },
      });
    }

    const trimmedTitle = title.trim();

    // 1. Edge Case Deduplication: Check if this question was already submitted for this company
    // Matches if title is identical (case-insensitive) or problem URL is identical
    const existingCommunityProblem = await prisma.communityProblem.findFirst({
      where: {
        companyId: company.id,
        OR: [
          { title: { equals: trimmedTitle, mode: "insensitive" as const } },
          ...(sanitizedProblemUrl
            ? [{ problemUrl: { equals: sanitizedProblemUrl } }]
            : []),
        ],
      },
      include: {
        company: { select: { name: true, slug: true } },
      },
    });

    if (existingCommunityProblem) {
      // Merge: Increment upvote (+1 verified) and merge topic tags
      const mergedTopics = Array.from(
        new Set([...existingCommunityProblem.topics, ...topicList])
      );

      const updatedSubmission = await prisma.communityProblem.update({
        where: { id: existingCommunityProblem.id },
        data: {
          upvotes: { increment: 1 },
          topics: mergedTopics,
          ...(sanitizedProblemUrl && !existingCommunityProblem.problemUrl
            ? { problemUrl: sanitizedProblemUrl }
            : {}),
          ...(notes && !existingCommunityProblem.notes
            ? { notes: String(notes).trim() }
            : {}),
        },
        include: {
          company: { select: { name: true, slug: true } },
        },
      });

      // Invalidate Redis cache for this company's problems and sidebar
      await invalidateCache(
        `cache:company:${company.slug}:problems`,
        "cache:companies:sidebar"
      );

      return NextResponse.json(
        {
          success: true,
          isMerged: true,
          message: `Question was already submitted for ${company.name}! Added your verification (+1 upvote) to the existing card.`,
          submission: updatedSubmission,
        },
        { status: 200 }
      );
    }

    // 2. Check if this question already exists in the official curated problem list for this company
    const existingCuratedProblem = await prisma.problem.findFirst({
      where: {
        companies: { some: { companyId: company.id } },
        OR: [
          { title: { equals: trimmedTitle, mode: "insensitive" as const } },
          ...(sanitizedProblemUrl
            ? [{ leetcodeUrl: { equals: sanitizedProblemUrl } }]
            : []),
        ],
      },
    });

    if (existingCuratedProblem) {
      return NextResponse.json(
        {
          success: true,
          isExistingCurated: true,
          message: `"${existingCuratedProblem.title}" is already in the official curated list for ${company.name}!`,
        },
        { status: 200 }
      );
    }

    // Create the new CommunityProblem in database
    const newSubmission = await prisma.communityProblem.create({
      data: {
        companyId: company.id,
        userId: userId || null,
        platform: normalizedPlatform,
        title: trimmedTitle,
        problemUrl: sanitizedProblemUrl,
        difficulty: normalizedDifficulty,
        roundType: roundType.trim(),
        interviewMonth: interviewMonth ? String(interviewMonth).trim() : null,
        interviewYear: interviewYear ? Number(interviewYear) : null,
        timeframe: timeframe ? String(timeframe).trim() : "ALL",
        topics: topicList,
        notes: notes ? String(notes).trim() : null,
        upvotes: 1,
      },
      include: {
        company: { select: { name: true, slug: true } },
      },
    });

    // Invalidate Redis cache for this company's problems and sidebar count
    await invalidateCache(
      `cache:company:${company.slug}:problems`,
      "cache:companies:sidebar"
    );

    // Trigger dynamic notifications
    try {
      if (userId && typeof userId === "string") {
        await NotificationService.notifyCommunityQuestionSubmitted(
          userId,
          company.name,
          trimmedTitle
        );
      }
    } catch (notifErr) {
      console.warn("[SubmissionsAPI] Failed to trigger notification:", notifErr);
    }

    return NextResponse.json({
      success: true,
      message: "Interview question submitted successfully",
      submission: newSubmission,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating community problem submission:", error);
    return NextResponse.json(
      { error: "Failed to submit interview question" },
      { status: 500 }
    );
  }
}
