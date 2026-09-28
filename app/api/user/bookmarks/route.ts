import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NotificationService } from "@/lib/services/notification.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required userId" },
        { status: 400 }
      );
    }

    const records = await prisma.userBookmarkProblem.findMany({
      where: { userId },
      select: { problemId: true },
    });

    const bookmarkedIds = records.map((r) => r.problemId);
    return NextResponse.json({ success: true, bookmarkedIds });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, problemId, action, bookmarkedIds } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required userId" },
        { status: 400 }
      );
    }

    // Ensure user exists in database
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    // 1. Bulk sync on initial login
    if (action === "sync" && Array.isArray(bookmarkedIds)) {
      for (const pid of bookmarkedIds) {
        if (typeof pid !== "number") continue;
        await prisma.userBookmarkProblem.upsert({
          where: {
            userId_problemId: {
              userId,
              problemId: pid,
            },
          },
          update: {},
          create: {
            userId,
            problemId: pid,
          },
        });
      }
    }

    // 2. Toggle single problem bookmark
    if (typeof problemId === "number") {
      const existing = await prisma.userBookmarkProblem.findUnique({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
      });

      if (existing) {
        await prisma.userBookmarkProblem.delete({
          where: { id: existing.id },
        });
      } else {
        await prisma.userBookmarkProblem.create({
          data: {
            userId,
            problemId,
          },
        });

        // Trigger dynamic notification
        try {
          const problem = await prisma.problem.findUnique({
            where: { id: problemId },
            include: {
              companies: {
                include: { company: true },
                take: 1,
              },
            },
          });

          if (problem) {
            const primaryCompany = problem.companies[0]?.company;
            await NotificationService.notifyBookmarkAdded(
              userId,
              problem.title,
              primaryCompany?.slug
            );
          }
        } catch (notifErr) {
          console.warn("[BookmarksAPI] Failed to trigger notification:", notifErr);
        }
      }
    }

    const updated = await prisma.userBookmarkProblem.findMany({
      where: { userId },
      select: { problemId: true },
    });

    return NextResponse.json({
      success: true,
      bookmarkedIds: updated.map((r) => r.problemId),
    });
  } catch (error) {
    console.error("Error updating bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to update bookmarks" },
      { status: 500 }
    );
  }
}
