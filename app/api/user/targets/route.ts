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

    const records = await prisma.userTargetCompany.findMany({
      where: { userId },
      include: {
        company: {
          select: { slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const targets = records.map((r) => r.company.slug.toLowerCase());
    return NextResponse.json({ success: true, targets });
  } catch (error) {
    console.error("Error fetching user targets:", error);
    return NextResponse.json(
      { error: "Failed to fetch user targets" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, slug, action, targets } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required userId" },
        { status: 400 }
      );
    }

    // Ensure the User row exists in DB
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    // 1. Bulk Sync: Upsert multiple target slugs (e.g. on login or initial migration)
    if (action === "sync" && Array.isArray(targets)) {
      for (const rawSlug of targets) {
        if (!rawSlug || typeof rawSlug !== "string") continue;
        const s = rawSlug.toLowerCase().trim();
        const company = await prisma.company.findFirst({
          where: { slug: { equals: s, mode: "insensitive" } },
        });
        if (company) {
          await prisma.userTargetCompany.upsert({
            where: {
              userId_companyId: {
                userId,
                companyId: company.id,
              },
            },
            update: {},
            create: {
              userId,
              companyId: company.id,
            },
          });
        }
      }
    }

    // 2. Toggle a single company target
    if (slug && typeof slug === "string") {
      const s = slug.toLowerCase().trim();
      const company = await prisma.company.findFirst({
        where: { slug: { equals: s, mode: "insensitive" } },
      });

      if (!company) {
        return NextResponse.json(
          { error: `Company with slug '${slug}' not found` },
          { status: 404 }
        );
      }

      const existing = await prisma.userTargetCompany.findUnique({
        where: {
          userId_companyId: {
            userId,
            companyId: company.id,
          },
        },
      });

      if (existing) {
        await prisma.userTargetCompany.delete({
          where: { id: existing.id },
        });
      } else {
        await prisma.userTargetCompany.create({
          data: {
            userId,
            companyId: company.id,
          },
        });

        // Trigger dynamic notification
        try {
          await NotificationService.notifyTargetAdded(userId, company.name, company.slug);
        } catch (notifErr) {
          console.warn("[TargetsAPI] Failed to trigger notification:", notifErr);
        }
      }
    }

    // Fetch and return the updated target list for this user
    const updatedRecords = await prisma.userTargetCompany.findMany({
      where: { userId },
      include: {
        company: {
          select: { slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const updatedTargets = updatedRecords.map((r) =>
      r.company.slug.toLowerCase()
    );

    return NextResponse.json({ success: true, targets: updatedTargets });
  } catch (error) {
    console.error("Error updating user targets:", error);
    return NextResponse.json(
      { error: "Failed to update user targets" },
      { status: 500 }
    );
  }
}
