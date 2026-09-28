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

    const records = await prisma.userSolvedProblem.findMany({
      where: { userId },
      select: { problemId: true },
    });

    const solvedIds = records.map((r) => r.problemId);
    return NextResponse.json({ success: true, solvedIds });
  } catch (error) {
    console.error("Error fetching solved problems:", error);
    return NextResponse.json(
      { error: "Failed to fetch solved problems" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, problemId, action, solvedIds } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required userId" },
        { status: 400 }
      );
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    // 1. Bulk sync on initial login
    if (action === "sync" && Array.isArray(solvedIds)) {
      for (const pid of solvedIds) {
        if (typeof pid !== "number") continue;
        await prisma.userSolvedProblem.upsert({
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

    // 2. Toggle single problem
    if (typeof problemId === "number") {
      const existing = await prisma.userSolvedProblem.findUnique({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
      });

      if (existing) {
        await prisma.userSolvedProblem.delete({
          where: { id: existing.id },
        });
      } else {
        await prisma.userSolvedProblem.create({
          data: {
            userId,
            problemId,
          },
        });

        // Trigger dynamic notification and target milestone check
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
            await NotificationService.notifyProblemSolved(
              userId,
              problem.title,
              problem.difficulty,
              primaryCompany?.slug
            );

            if (primaryCompany) {
              await NotificationService.checkAndNotifyTargetMilestone(
                userId,
                primaryCompany.id,
                primaryCompany.name,
                primaryCompany.slug
              );
            }
          }
        } catch (notifErr) {
          console.warn("[SolvedAPI] Failed to trigger notification:", notifErr);
        }
      }
    }

    const updated = await prisma.userSolvedProblem.findMany({
      where: { userId },
      select: { problemId: true },
    });

    return NextResponse.json({
      success: true,
      solvedIds: updated.map((r) => r.problemId),
    });
  } catch (error) {
    console.error("Error updating solved problems:", error);
    return NextResponse.json(
      { error: "Failed to update solved problems" },
      { status: 500 }
    );
  }
}
