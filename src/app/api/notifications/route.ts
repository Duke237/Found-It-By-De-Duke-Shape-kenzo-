import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/db";
import { users, notifications } from "@/db/schema";
import { 
  getUserNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead,
  clearAllNotifications
} from "@/lib/notifications/notification-service";
import { eq } from "drizzle-orm";

// GET - Fetch notifications for current user
export async function GET(req: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user from database
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, sessionUser.email));

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get notifications and unread count
  const userNotifications = await getUserNotifications(user.id);
  const unreadCount = await getUnreadCount(user.id);

  return NextResponse.json({
    notifications: userNotifications,
    unreadCount,
  });
}

// PATCH - Mark notifications as read
export async function PATCH(req: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user from database
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, sessionUser.email));

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as {
    notificationId?: number;
    markAll?: boolean;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Mark single notification as read
  if (body.notificationId) {
    await markAsRead(body.notificationId);
    return NextResponse.json({ success: true, message: "Notification marked as read" });
  }

  // Mark all notifications as read
  if (body.markAll) {
    await markAllAsRead(user.id);
    return NextResponse.json({ success: true, message: "All notifications marked as read" });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

// DELETE - Clear all notifications for current user
export async function DELETE() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user from database
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, sessionUser.email));

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await clearAllNotifications(user.id);
  return NextResponse.json({ success: true, message: "All notifications cleared" });
}
