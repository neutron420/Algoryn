"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Bell, GripVertical, Trash2, Archive, ChevronRight, CheckCheck, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/context/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  linkUrl?: string | null;
  isRead?: boolean;
}

interface NotificationsWithActionsProps {
  items?: NotificationItem[];
  placement?: "top" | "right" | "bottom" | "left";
}

export default function NotificationsWithActions({
  placement = "bottom",
}: NotificationsWithActionsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = React.useState<number>(0);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Format relative timestamp without emojis
  const formatTime = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  // Fetch real notifications dynamically from backend
  const fetchNotifications = React.useCallback(async () => {
    if (!user?.uid) return;
    try {
      const res = await fetch(`/api/notifications?userId=${encodeURIComponent(user.uid)}&limit=30`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.notifications)) {
          const mapped: NotificationItem[] = data.notifications.map((n: {
            id: string;
            title: string;
            message: string;
            createdAt: string;
            linkUrl?: string | null;
            isRead?: boolean;
          }) => ({
            id: n.id,
            title: n.title,
            description: n.message,
            time: formatTime(n.createdAt),
            linkUrl: n.linkUrl,
            isRead: n.isRead,
          }));
          setNotifications(mapped);
          setUnreadCount(data.unreadCount || 0);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch notifications:", err);
    }
  }, [user?.uid]);

  React.useEffect(() => {
    if (!user?.uid) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 25000);
    const handleFocus = () => fetchNotifications();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [user?.uid, fetchNotifications]);

  // Comprehensive Background Scroll Lock:
  // Freezes both documentElement (html) and body, plus intercepts non-notification wheel and touchmove events
  React.useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    // Prevent horizontal layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Intercept wheel/touchmove on anything that is NOT inside our notification scroll area
    const handleGlobalWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      const isInside = target?.closest("[data-notification-scroll]");
      if (!isInside) {
        e.preventDefault();
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      const isInside = target?.closest("[data-notification-scroll]");
      if (!isInside) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleGlobalWheel, { passive: false });
    window.addEventListener("touchmove", handleGlobalTouchMove, { passive: false });

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.touchAction = originalTouchAction;
      document.body.style.paddingRight = "";
      window.removeEventListener("wheel", handleGlobalWheel);
      window.removeEventListener("touchmove", handleGlobalTouchMove);
    };
  }, [isOpen]);

  const handleArchive = async (id: string) => {
    if (!user?.uid) return;
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    setActiveId(null);

    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, notificationId: id }),
      });
    } catch (err) {
      console.warn("Failed to mark notification as read:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.uid) return;
    const target = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (target && !target.isRead) {
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    setActiveId(null);

    try {
      await fetch(
        `/api/notifications?userId=${encodeURIComponent(user.uid)}&notificationId=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
    } catch (err) {
      console.warn("Failed to delete notification:", err);
    }
  };

  // Redirect to destination post & comment section seamlessly
  const handleItemClick = (item: NotificationItem) => {
    if (!item.isRead) {
      handleArchive(item.id);
    }
    setIsOpen(false);

    if (item.linkUrl) {
      let target = item.linkUrl;
      const lowerTitle = item.title.toLowerCase();
      const isCommentOrQuestion =
        lowerTitle.includes("question") ||
        lowerTitle.includes("comment") ||
        lowerTitle.includes("reply");

      // Ensure #comments anchor is appended for comment/question notifications
      if (isCommentOrQuestion && !target.includes("#comments")) {
        target = `${target}#comments`;
      }

      router.push(target);

      // If already on that target page, trigger immediate smooth scroll
      if (typeof window !== "undefined") {
        setTimeout(() => {
          const commentsSection = document.getElementById("comments");
          if (commentsSection) {
            commentsSection.scrollIntoView({ behavior: "smooth", block: "start" });
            const input = commentsSection.querySelector<HTMLInputElement>("input[type='text'], input[placeholder*='comment']");
            if (input) input.focus();
          }
        }, 300);
      }
    }
  };

  const handleMarkAllRead = async () => {
    if (!user?.uid || unreadCount === 0) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, markAll: true }),
      });
    } catch (err) {
      console.warn("Failed to mark all as read:", err);
    }
  };

  // Guard against scroll chaining at the top and bottom of the notification list
  const handleScrollAreaWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const isUp = e.deltaY < 0;
    const isDown = e.deltaY > 0;
    const atTop = el.scrollTop <= 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

    if ((isUp && atTop) || (isDown && atBottom)) {
      e.preventDefault();
    }
  };

  // Notification items list markup
  const renderNotificationList = (isMobileView: boolean) => {
    if (notifications.length === 0) {
      return (
        <div className="p-8 text-sm text-muted-foreground text-center select-none">
          No notifications
        </div>
      );
    }

    return (
      <div
        data-notification-scroll="true"
        onWheel={handleScrollAreaWheel}
        className={cn(
          "overflow-y-auto overscroll-contain divide-y divide-border/60",
          isMobileView ? "max-h-[62dvh] pb-6" : "max-h-80"
        )}
      >
        <ul className="divide-y divide-border/60">
          {notifications.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={cn(
                  "flex items-center justify-between p-3.5 sm:p-3.5 transition-colors cursor-pointer relative group",
                  !item.isRead ? "bg-primary/[0.03] hover:bg-primary/[0.06]" : "hover:bg-muted/40"
                )}
              >
                {/* Left text container */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex justify-between items-center mb-1 gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {!item.isRead && (
                        <span className="size-1.5 rounded-full bg-primary shrink-0" title="Unread" />
                      )}
                      <span className="font-semibold text-xs sm:text-sm truncate text-foreground">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground shrink-0 font-medium font-mono">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Right side controls */}
                <div
                  className="ml-1.5 sm:ml-2 flex items-center shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isActive ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.88, x: 8 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.88, x: 8 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className="flex items-center gap-1 bg-muted/90 dark:bg-muted/70 backdrop-blur-xs p-1 rounded-lg border border-border shadow-xs"
                    >
                      <button
                        type="button"
                        className="size-7 sm:size-7.5 rounded-md flex items-center justify-center hover:bg-background/90 text-muted-foreground hover:text-foreground transition-colors cursor-pointer touch-manipulation"
                        title={item.isRead ? "Mark as unread" : "Mark as read"}
                        onClick={() => handleArchive(item.id)}
                      >
                        <Archive className="size-3.5 sm:size-4" />
                      </button>
                      <button
                        type="button"
                        className="size-7 sm:size-7.5 rounded-md flex items-center justify-center hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-colors cursor-pointer touch-manipulation"
                        title="Delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="size-3.5 sm:size-4 text-destructive" />
                      </button>
                      <button
                        type="button"
                        className="size-7 sm:size-7.5 rounded-md flex items-center justify-center hover:bg-background/90 text-muted-foreground hover:text-foreground transition-colors cursor-pointer touch-manipulation"
                        title="Close actions"
                        onClick={() => setActiveId(null)}
                      >
                        <ChevronRight className="size-3.5 sm:size-4" />
                      </button>
                    </motion.div>
                  ) : (
                    <button
                      type="button"
                      className="size-8 rounded-md flex items-center justify-center hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer touch-manipulation"
                      title="Actions"
                      onClick={() => setActiveId(item.id)}
                    >
                      <GripVertical className="size-4" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  // Shared visual trigger button content
  const BellButtonContent = (
    <>
      <Bell className="size-4 shrink-0 transition-transform group-hover:scale-105" />
      {unreadCount > 0 && (
        <span
          className="absolute -top-1 -right-1 flex items-center justify-center h-4 min-w-4 px-1 text-[10px] font-bold font-mono text-white bg-red-500 rounded-full ring-2 ring-background shadow-xs leading-none pointer-events-none"
        >
          {unreadCount > 5 ? "5+" : unreadCount}
        </span>
      )}
    </>
  );

  // If on mobile screen: render Mobile Drawer / Bottom Sheet via React Portal
  if (mounted && isMobile) {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center size-8 sm:size-8.5 rounded-lg border border-border/80 bg-muted/40 hover:bg-muted/70 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all duration-150 cursor-pointer shadow-2xs touch-manipulation"
          aria-label="View notifications"
          title="Notifications"
        >
          {BellButtonContent}
        </button>

        {createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-50 flex flex-col justify-end">
                {/* Backdrop Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                />

                {/* Mobile Bottom Drawer Container */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 320 }}
                  drag="y"
                  dragConstraints={{ top: 0 }}
                  dragElastic={{ top: 0, bottom: 0.4 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.y > 90 || info.velocity.y > 350) {
                      setIsOpen(false);
                    }
                  }}
                  className="relative z-50 w-full bg-background rounded-t-3xl border-t border-border shadow-2xl flex flex-col max-h-[82dvh] touch-manipulation"
                >
                  {/* Swipe Pull Handle */}
                  <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30 mx-auto mt-2.5 mb-1.5 shrink-0" />

                  {/* Mobile Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[11px] font-mono font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          {unreadCount > 5 ? "5+ unread" : `${unreadCount} unread`}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllRead}
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded-md hover:bg-muted/80 cursor-pointer transition-colors"
                        >
                          <CheckCheck className="size-3.5" />
                          <span>Mark all read</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="size-7 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                        aria-label="Close notifications"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* Scrollable list */}
                  {renderNotificationList(true)}
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </>
    );
  }

  // Desktop Popover Dropdown (modal mode for full document scroll lock & isolation)
  return (
    <Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group relative flex items-center justify-center size-8 sm:size-8.5 rounded-lg border border-border/80 bg-muted/40 hover:bg-muted/70 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all duration-150 cursor-pointer shadow-2xs touch-manipulation"
          aria-label="View notifications"
          title="Notifications"
        >
          {BellButtonContent}
        </button>
      </PopoverTrigger>
      <PopoverContent
        showBackdrop={true}
        className="w-[390px] max-w-[400px] p-0 shadow-2xl rounded-2xl overflow-hidden border border-border bg-background touch-manipulation z-50"
        align="end"
        side={placement}
        sideOffset={8}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                {unreadCount > 5 ? "5+ unread" : `${unreadCount} unread`}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-muted/80 cursor-pointer transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="size-3.5" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        <Card className="rounded-none border-none shadow-none">
          {renderNotificationList(false)}
        </Card>
      </PopoverContent>
    </Popover>
  );
}

// Export both named and default for seamless imports
export { NotificationsWithActions as NotificationBell };
export { NotificationsWithActions };
