import { prisma } from "@/lib/prisma";
import { NotificationType } from "@/app/generated/prisma/client";
import { getRedisClient } from "@/lib/redis";

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface GetNotificationsOptions {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: NotificationType;
}

const UNREAD_CACHE_TTL = 3600; // 1 hour

export class NotificationService {
  /**
   * Core method to create and persist a notification with Redis cache synchronization.
   * Runs safely in try-catch so notification errors never crash the calling action.
   */
  static async create(input: CreateNotificationInput) {
    try {
      if (!input.userId || !input.title || !input.message) {
        return null;
      }

      // Ensure user exists before inserting notification
      await prisma.user.upsert({
        where: { id: input.userId },
        update: {},
        create: { id: input.userId },
      });

      const notification = await prisma.notification.create({
        data: {
          userId: input.userId,
          type: input.type,
          title: input.title,
          message: input.message,
          linkUrl: input.linkUrl || null,
          metadata: (input.metadata as Record<string, string | number | boolean | null>) || undefined,
          isRead: false,
        },
      });

      // Synchronize Redis Cache
      const redis = getRedisClient();
      if (redis) {
        try {
          const unreadKey = `cache:notifications:unread:${input.userId}`;
          const listKey = `cache:notifications:recent:${input.userId}`;
          
          await Promise.all([
            redis.incr(unreadKey),
            redis.del(listKey),
          ]);
        } catch (cacheErr) {
          console.warn("[NotificationService] Redis cache update warning:", cacheErr);
        }
      }

      return notification;
    } catch (error) {
      console.error("[NotificationService] Failed to create notification:", error);
      return null;
    }
  }

  /**
   * Fetch paginated notifications for a user with total count and unread count.
   */
  static async getUserNotifications(userId: string, options: GetNotificationsOptions = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(50, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { userId };
    if (options.unreadOnly) {
      where.isRead = false;
    }
    if (options.type) {
      where.type = options.type;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
      this.getUnreadCount(userId),
    ]);

    return {
      notifications,
      total,
      unreadCount,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Fast unread notification count with Redis cache fallback to PostgreSQL.
   */
  static async getUnreadCount(userId: string): Promise<number> {
    if (!userId) return 0;
    const redis = getRedisClient();
    const cacheKey = `cache:notifications:unread:${userId}`;

    if (redis) {
      try {
        const cached = await redis.get<number>(cacheKey);
        if (cached !== null && cached !== undefined) {
          return Number(cached);
        }
      } catch (err) {
        console.warn("[NotificationService] Redis get count error:", err);
      }
    }

    try {
      const count = await prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      });

      if (redis) {
        try {
          await redis.set(cacheKey, count, { ex: UNREAD_CACHE_TTL });
        } catch {}
      }

      return count;
    } catch (error) {
      console.error("[NotificationService] Failed to get unread count from DB:", error);
      return 0;
    }
  }

  /**
   * Mark a single notification as read.
   */
  static async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      const updated = await prisma.notification.updateMany({
        where: {
          id: notificationId,
          userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

      if (updated.count > 0) {
        const redis = getRedisClient();
        if (redis) {
          try {
            const cacheKey = `cache:notifications:unread:${userId}`;
            const listKey = `cache:notifications:recent:${userId}`;
            await Promise.all([
              redis.decr(cacheKey),
              redis.del(listKey),
            ]);
          } catch {}
        }
      }

      return true;
    } catch (error) {
      console.error("[NotificationService] Failed to mark notification as read:", error);
      return false;
    }
  }

  /**
   * Mark all notifications as read for a user.
   */
  static async markAllAsRead(userId: string): Promise<number> {
    try {
      const result = await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

      const redis = getRedisClient();
      if (redis) {
        try {
          const cacheKey = `cache:notifications:unread:${userId}`;
          const listKey = `cache:notifications:recent:${userId}`;
          await Promise.all([
            redis.set(cacheKey, 0, { ex: UNREAD_CACHE_TTL }),
            redis.del(listKey),
          ]);
        } catch {}
      }

      return result.count;
    } catch (error) {
      console.error("[NotificationService] Failed to mark all notifications as read:", error);
      return 0;
    }
  }

  /**
   * Delete a notification.
   */
  static async delete(notificationId: string, userId: string): Promise<boolean> {
    try {
      await prisma.notification.deleteMany({
        where: {
          id: notificationId,
          userId,
        },
      });

      const redis = getRedisClient();
      if (redis) {
        try {
          await redis.del(`cache:notifications:unread:${userId}`);
          await redis.del(`cache:notifications:recent:${userId}`);
        } catch {}
      }

      return true;
    } catch (error) {
      console.error("[NotificationService] Failed to delete notification:", error);
      return false;
    }
  }

  // =========================================================================
  // DOMAIN ACTION TRIGGER HELPERS (No emojis, strictly professional)
  // =========================================================================

  /**
   * Trigger when a user marks a problem as solved.
   */
  static async notifyProblemSolved(
    userId: string,
    problemTitle: string,
    difficulty: string,
    companySlug?: string | null
  ) {
    const formattedDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
    const linkUrl = companySlug ? `/dashboard?company=${companySlug}` : "/dashboard";

    return this.create({
      userId,
      type: NotificationType.PROBLEM_SOLVED,
      title: "Problem Completed",
      message: `You completed ${problemTitle} (${formattedDiff}).`,
      linkUrl,
      metadata: { problemTitle, difficulty },
    });
  }

  /**
   * Check if solving a question triggered a target company milestone (e.g. 5, 10, 25, 50 solved).
   */
  static async checkAndNotifyTargetMilestone(userId: string, companyId: number, companyName: string, companySlug: string) {
    try {
      // Check if this company is a target for the user
      const isTarget = await prisma.userTargetCompany.findUnique({
        where: {
          userId_companyId: { userId, companyId },
        },
      });

      if (!isTarget) return;

      // Count solved problems for this company
      const solvedInCompanyCount = await prisma.userSolvedProblem.count({
        where: {
          userId,
          problem: {
            companies: {
              some: { companyId },
            },
          },
        },
      });

      // Milestone thresholds: 5, 10, 25, 50, 100
      const milestoneThresholds = [5, 10, 25, 50, 100];
      if (milestoneThresholds.includes(solvedInCompanyCount)) {
        await this.create({
          userId,
          type: NotificationType.TARGET_MILESTONE,
          title: "Target Company Milestone",
          message: `You have solved ${solvedInCompanyCount} problems for your target company ${companyName}.`,
          linkUrl: `/dashboard?company=${companySlug}`,
          metadata: { companyId, companyName, solvedCount: solvedInCompanyCount },
        });
      }
    } catch (err) {
      console.warn("[NotificationService] Milestone check failed:", err);
    }
  }

  /**
   * Trigger when a user adds a company to target companies.
   */
  static async notifyTargetAdded(userId: string, companyName: string, companySlug: string) {
    return this.create({
      userId,
      type: NotificationType.TARGET_ADDED,
      title: "Target Company Added",
      message: `${companyName} has been added to your preparation targets.`,
      linkUrl: `/dashboard?company=${companySlug}`,
      metadata: { companyName, companySlug },
    });
  }

  /**
   * Trigger when a user bookmarks a problem for revision.
   */
  static async notifyBookmarkAdded(userId: string, problemTitle: string, companySlug?: string | null) {
    return this.create({
      userId,
      type: NotificationType.BOOKMARK_ADDED,
      title: "Problem Bookmarked",
      message: `${problemTitle} has been saved to your revision list.`,
      linkUrl: companySlug ? `/dashboard?company=${companySlug}` : "/dashboard",
      metadata: { problemTitle },
    });
  }

  /**
   * Trigger when someone comments on a discussion post or an interview experience.
   */
  static async notifyDiscussionComment(
    postAuthorId: string,
    commenterName: string,
    postTitle: string,
    postId: string,
    isInterviewExperience: boolean
  ) {
    if (isInterviewExperience) {
      return this.create({
        userId: postAuthorId,
        type: NotificationType.INTERVIEW_COMMENT,
        title: "Interview Experience Question",
        message: `${commenterName} asked a question on your interview experience "${postTitle}".`,
        linkUrl: `/dashboard/interview-experiences/${postId}#comments`,
        metadata: { postId, commenterName, isInterviewExperience: true },
      });
    }

    return this.create({
      userId: postAuthorId,
      type: NotificationType.DISCUSSION_REPLY,
      title: "Discussion Reply",
      message: `${commenterName} commented on your discussion "${postTitle}".`,
      linkUrl: `/dashboard/discussions?id=${postId}#comments`,
      metadata: { postId, commenterName, isInterviewExperience: false },
    });
  }

  /**
   * Trigger when someone replies directly to a user's comment.
   */
  static async notifyCommentReply(
    parentCommentAuthorId: string,
    replierName: string,
    commentPreview: string,
    postId: string,
    isInterviewExperience: boolean
  ) {
    const truncatedPreview = commentPreview.length > 35 ? `${commentPreview.slice(0, 35)}...` : commentPreview;
    const linkUrl = isInterviewExperience
      ? `/dashboard/interview-experiences/${postId}#comments`
      : `/dashboard/discussions?id=${postId}#comments`;

    return this.create({
      userId: parentCommentAuthorId,
      type: isInterviewExperience ? NotificationType.INTERVIEW_COMMENT : NotificationType.DISCUSSION_REPLY,
      title: "Reply to Your Comment",
      message: `${replierName} replied to your comment: "${truncatedPreview}".`,
      linkUrl,
      metadata: { postId, replierName },
    });
  }

  /**
   * Trigger when someone likes a discussion post or interview experience.
   */
  static async notifyDiscussionLiked(
    postAuthorId: string,
    likerName: string,
    postTitle: string,
    postId: string,
    isInterviewExperience: boolean
  ) {
    const linkUrl = isInterviewExperience
      ? `/dashboard/interview-experiences/${postId}`
      : `/dashboard/discussions?id=${postId}`;

    return this.create({
      userId: postAuthorId,
      type: NotificationType.DISCUSSION_LIKE,
      title: isInterviewExperience ? "Interview Experience Upvoted" : "Discussion Upvoted",
      message: `${likerName} upvoted your ${isInterviewExperience ? "interview experience" : "discussion"} "${postTitle}".`,
      linkUrl,
      metadata: { postId, likerName },
    });
  }

  /**
   * Trigger when a user shares a community interview question.
   */
  static async notifyCommunityQuestionSubmitted(userId: string, companyName: string, problemTitle: string) {
    return this.create({
      userId,
      type: NotificationType.COMMUNITY_QUESTION_ADDED,
      title: "Question Shared",
      message: `Your interview question "${problemTitle}" for ${companyName} has been shared with the community.`,
      linkUrl: `/dashboard?company=${companyName.toLowerCase()}`,
      metadata: { companyName, problemTitle },
    });
  }
}
