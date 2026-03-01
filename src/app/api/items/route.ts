import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/db";
import { items, users } from "@/db/schema";
import { broadcastNotification } from "@/lib/notifications/notification-service";
import { processNewItem } from "@/lib/matching/ai-matching-service";
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

  // Step 1: Broadcast notification to ALL users (except sender)
  const broadcastTitle = type === "lost" ? "📢 New Lost Item Reported" : "📢 New Found Item Reported";
  const broadcastMessage = `A new ${type} item has been reported: "${title}" in ${location}. Check if it's yours!`;
  
  // Fire and forget - don't await
  broadcastNotification(user.id, broadcastTitle, broadcastMessage, newItem.id)
    .then(() => console.log("Broadcast notification sent"))
    .catch(err => console.error("Failed to send broadcast:", err));

  // Step 2: Trigger AI matching service (fire and forget)
  processNewItem(newItem.id, type)
    .then(matches => console.log(`AI matching complete. Found ${matches.length} matches`))
    .catch(err => console.error("AI matching failed:", err));

  return NextResponse.json({
    success: true,
    item: newItem,
    message: "Item submitted successfully. Notifications are being sent.",
  });
}

// GET route to fetch items (for browsing)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as "lost" | "found" | null;
  const category = searchParams.get("category");
  const status = (searchParams.get("status") || "approved") as "pending" | "approved" | "rejected" | "resolved";

  let query;
  if (type) {
    query = db.select().from(items).where(
      type === "lost" 
        ? eq(items.type, "lost")
        : eq(items.type, "found")
    );
  } else {
    query = db.select().from(items).where(eq(items.status, status));
  }

  const allItems = await query;

  // Filter by category and status if provided
  let filteredItems = allItems;
  if (category) {
    filteredItems = filteredItems.filter(item => item.category === category);
  }
  if (!type) {
    filteredItems = filteredItems.filter(item => item.status === status);
  }

  return NextResponse.json({ items: filteredItems });
}
