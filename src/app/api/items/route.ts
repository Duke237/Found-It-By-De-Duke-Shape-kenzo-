import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/db";
import { items, users } from "@/db/schema";
import {
  queueItemMatching,
  queueBroadcastNotification,
} from "@/lib/jobs/job-queue";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  // Check authentication
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

  // Parse request body
  const body = (await req.json().catch(() => null)) as {
    type?: "lost" | "found";
    title?: string;
    description?: string;
    category?: string;
    location?: string;
    date?: string;
    imageUrl?: string;
    contactNumber?: string;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Validate required fields
  const { type, title, description, category, location, date, imageUrl, contactNumber } = body;

  if (!type || !title || !description || !category || !location || !date || !contactNumber) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Validate type
  if (type !== "lost" && type !== "found") {
    return NextResponse.json({ error: "Invalid item type" }, { status: 400 });
  }

  // Create the item
  const [newItem] = await db
    .insert(items)
    .values({
      userId: user.id,
      type,
      title,
      description,
      category,
      location,
      date: new Date(date),
      imageUrl: imageUrl || null,
      contactNumber,
      status: "pending", // Default status
    })
    .returning();

  // Step 1: Queue broadcast notification to ALL users (except sender)
  const broadcastTitle = type === "lost" ? "📢 New Lost Item Reported" : "📢 New Found Item Reported";
  const broadcastMessage = `A new ${type} item has been reported: "${title}" in ${location}. Check if it's yours!`;

  // Queue background jobs for real-time processing
  try {
    // Initialize workers if not already done
    const { initializeWorkers } = await import("@/lib/jobs/job-queue");
    initializeWorkers();

    // Queue broadcast notification
    await queueBroadcastNotification({
      excludeUserId: user.id,
      title: broadcastTitle,
      message: broadcastMessage,
      itemId: newItem.id,
      itemType: type,
    });

    // Queue AI matching job
    await queueItemMatching({
      itemId: newItem.id,
      itemType: type,
      userId: user.id,
      title,
      location,
    });

    console.log("[Items API] Background jobs queued successfully");
  } catch (error) {
    console.error("[Items API] Failed to queue background jobs:", error);
    // Don't fail the request - item is already saved
  }

  return NextResponse.json({
    success: true,
    item: newItem,
    message: "Item submitted successfully. Notifications and AI matching are processing in the background.",
  });
}

// GET route to fetch items (for browsing or user's items)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as "lost" | "found" | null;
  const category = searchParams.get("category");
  const status = searchParams.get("status") as "pending" | "approved" | "rejected" | "resolved" | null;
  const mine = searchParams.get("mine") === "true";

  // If "mine" is true, fetch only current user's items
  if (mine) {
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

    let query = db.select().from(items).where(eq(items.userId, user.id));
    
    // Filter by type if specified
    if (type) {
      query = db.select().from(items).where(
        type === "lost"
          ? eq(items.type, "lost")
          : eq(items.type, "found")
      );
      // Re-apply user filter
      const allItemsOfType = await query;
      const userItems = allItemsOfType.filter(item => item.userId === user.id);
      return NextResponse.json({ items: userItems });
    }

    const userItems = await query;
    return NextResponse.json({ items: userItems });
  }

  // Public browsing - filter by status (default to approved)
  const defaultStatus = status || "approved";

  let query;
  if (type) {
    query = db.select().from(items).where(
      type === "lost"
        ? eq(items.type, "lost")
        : eq(items.type, "found")
    );
  } else {
    query = db.select().from(items).where(eq(items.status, defaultStatus));
  }

  const allItems = await query;

  // Filter by category and status if provided
  let filteredItems = allItems;
  if (category) {
    filteredItems = filteredItems.filter(item => item.category === category);
  }
  if (!type) {
    filteredItems = filteredItems.filter(item => item.status === defaultStatus);
  }

  return NextResponse.json({ items: filteredItems });
}
