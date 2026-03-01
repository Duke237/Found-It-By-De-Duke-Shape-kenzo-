import { db } from "@/db";
import { notifications, users, items } from "@/db/schema";
import { eq, ne, and } from "drizzle-orm";

export type NotificationType = "broadcast" | "match_found" | "submission_status" | "system";

interface CreateNotificationParams {
  userId?: number;
  type: NotificationType;
  title: string;
  message: string;
  itemId?: number;
}

/**
 * Create a notification for a specific user
 */
export async function createNotification({
  userId,
  type,
  title,
  message,
  itemId,
}: CreateNotificationParams) {
  const [notification] = await db
    .insert(notifications)
    .values({
      userId,
      type,
      title,
      message,
      itemId,
      isRead: false,
    })
    .returning();

  return notification;
}

/**
 * Broadcast a notification to ALL users (except the sender)
 * Used when a new lost/found item is reported
 */
export async function broadcastNotification(
  excludeUserId: number,
  title: string,
  message: string,
  itemId?: number
) {
  // Get all user IDs except the sender
  const allUsers = await db
    .select({ id: users.id })
    .from(users)
    .where(ne(users.id, excludeUserId));

  // Create notifications for all users
  const notificationPromises = allUsers.map((user) =>
    createNotification({
      userId: user.id,
      type: "broadcast",
      title,
      message,
      itemId,
    })
  );

  await Promise.all(notificationPromises);
}

/**
 * Send a targeted match notification ONLY to the specific user
 * who uploaded the matching item
 */
export async function sendMatchNotification(
  targetUserId: number,
  matchedItemId: number,
  matchedItemType: "lost" | "found",
  matchScore: number
) {
  // Get the matched item details
  const [matchedItem] = await db
    .select()
    .from(items)
    .where(eq(items.id, matchedItemId));

  if (!matchedItem) return null;

  const itemTypeText = matchedItemType === "lost" ? "lost" : "found";
  const title = `🔍 Potential Match Found! (${Math.round(matchScore * 100)}% match)`;
  const message = `We found a potential match for your ${itemTypeText} item "${matchedItem.title}". Check your dashboard for details!`;

  const notification = await createNotification({
    userId: targetUserId,
    type: "match_found",
    title,
    message,
    itemId: matchedItemId,
  });

  return notification;
}

/**
 * Get all notifications for a user
 */
export async function getUserNotifications(userId: number) {
  const userNotifications = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(notifications.createdAt)
    .limit(50);

  return userNotifications;
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(userId: number) {
  const result = await db
    .select({ count: notifications.id })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

  return result.length;
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: number) {
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, notificationId));
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: number) {
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
}

/**
 * Delete all notifications for a user
 */
export async function clearAllNotifications(userId: number) {
  await db
    .delete(notifications)
    .where(eq(notifications.userId, userId));
}

/**
 * Send notification when match status is updated by admin
 */
export async function sendMatchStatusNotification(
  match: { lostItemId: number; foundItemId: number; similarityScore: number },
  status: "confirmed" | "rejected"
) {
  // Get both items and their owners
  const [lostItem] = await db
    .select({
      id: items.id,
      title: items.title,
      userId: items.userId,
    })
    .from(items)
    .where(eq(items.id, match.lostItemId));

  const [foundItem] = await db
    .select({
      id: items.id,
      title: items.title,
      userId: items.userId,
    })
    .from(items)
    .where(eq(items.id, match.foundItemId));

  if (!lostItem || !foundItem) return;

  const title = status === "confirmed" 
    ? "✅ Match Confirmed by Admin" 
    : "❌ Match Rejected by Admin";
  
  const message = status === "confirmed"
    ? `Great news! The admin has confirmed a match between your lost item "${lostItem.title}" and a found item "${foundItem.title}". You can now contact each other!`
    : `The admin has reviewed and rejected the potential match between "${lostItem.title}" and "${foundItem.title}". We'll continue searching for better matches.`;

  // Notify both users
  const { emitToUser } = await import("@/app/api/socketio/route");

  // Notify lost item owner
  const lostNotification = await createNotification({
    userId: lostItem.userId,
    type: "match_found",
    title,
    message,
    itemId: lostItem.id,
  });
  emitToUser(lostItem.userId, "notification", lostNotification);

  // Notify found item owner
  const foundNotification = await createNotification({
    userId: foundItem.userId,
    type: "match_found",
    title,
    message,
    itemId: foundItem.id,
  });
  emitToUser(foundItem.userId, "notification", foundNotification);
}
