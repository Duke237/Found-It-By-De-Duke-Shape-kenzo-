"use client";

import { useNotificationCount } from "@/lib/websocket/use-socket";

interface NotificationBadgeProps {
  userId?: string | number;
  className?: string;
}

export function NotificationBadge({ userId, className = "" }: NotificationBadgeProps) {
  const { unreadCount, loading } = useNotificationCount(userId);

  if (loading || unreadCount === 0) {
    return null;
  }

  return (
    <span
      className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1 animate-pulse ${className}`}
    >
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  );
}

/**
 * Static badge for cases where real-time isn't needed
 */
export function StaticNotificationBadge({
  count,
  className = "",
}: {
  count: number;
  className?: string;
}) {
  if (count === 0) {
    return null;
  }

  return (
    <span
      className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1 ${className}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
