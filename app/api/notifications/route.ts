import { NextResponse } from "next/server";
import { NotificationService } from "@/lib/services/notification.service";
import { NotificationType } from "@/app/generated/prisma/client";

export const runtime = "nodejs";

// GET /api/notifications?userId=xyz&page=1&limit=20&unreadOnly=false
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

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const typeParam = searchParams.get("type");

    let validNotificationType: NotificationType | undefined = undefined;
    if (typeParam && Object.values(NotificationType).includes(typeParam as NotificationType)) {
      validNotificationType = typeParam as NotificationType;
    }

    const result = await NotificationService.getUserNotifications(userId, {
      page,
      limit,
      unreadOnly,
      type: validNotificationType,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications
// Body: { userId, notificationId, markAll }
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, notificationId, markAll } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required userId" },
        { status: 400 }
      );
    }

    if (markAll) {
      await NotificationService.markAllAsRead(userId);
    } else if (notificationId) {
      await NotificationService.markAsRead(notificationId, userId);
    } else {
      return NextResponse.json(
        { error: "Provide either notificationId or markAll: true" },
        { status: 400 }
      );
    }

    const unreadCount = await NotificationService.getUnreadCount(userId);

    return NextResponse.json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const notificationId = searchParams.get("notificationId");

    if (!userId || !notificationId) {
      return NextResponse.json(
        { error: "Missing required userId or notificationId" },
        { status: 400 }
      );
    }

    await NotificationService.delete(notificationId, userId);
    const unreadCount = await NotificationService.getUnreadCount(userId);

    return NextResponse.json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
