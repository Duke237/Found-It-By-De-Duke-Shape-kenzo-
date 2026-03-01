import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/db";
import { matches, items, users } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

// GET - Fetch all matches with item details
export async function GET(req: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || sessionUser.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as "pending" | "confirmed" | "rejected" | null;

  try {
    let query = db
      .select({
        match: matches,
        lostItem: items,
        foundItem: {
          id: sql<number>`found_item.id`,
          title: sql<string>`found_item.title`,
          description: sql<string>`found_item.description`,
          category: sql<string>`found_item.category`,
          location: sql<string>`found_item.location`,
          imageUrl: sql<string | null>`found_item.image_url`,
          userId: sql<number>`found_item.user_id`,
        },
        lostUser: {
          id: sql<number>`lost_user.id`,
          username: sql<string>`lost_user.username`,
          email: sql<string>`lost_user.email`,
        },
        foundUser: {
          id: sql<number>`found_user.id`,
          username: sql<string>`found_user.username`,
          email: sql<string>`found_user.email`,
        },
      })
      .from(matches)
      .innerJoin(items, eq(matches.lostItemId, items.id))
      .innerJoin(sql`items as found_item`, eq(matches.foundItemId, sql`found_item.id`))
      .innerJoin(sql`users as lost_user`, eq(items.userId, sql`lost_user.id`))
      .innerJoin(sql`users as found_user`, eq(sql`found_item.user_id`, sql`found_user.id`))
      .orderBy(desc(matches.similarityScore));

    if (status) {
      query = db
        .select({
          match: matches,
          lostItem: items,
          foundItem: {
            id: sql<number>`found_item.id`,
            title: sql<string>`found_item.title`,
            description: sql<string>`found_item.description`,
            category: sql<string>`found_item.category`,
            location: sql<string>`found_item.location`,
            imageUrl: sql<string | null>`found_item.image_url`,
            userId: sql<number>`found_item.user_id`,
          },
          lostUser: {
            id: sql<number>`lost_user.id`,
            username: sql<string>`lost_user.username`,
            email: sql<string>`lost_user.email`,
          },
          foundUser: {
            id: sql<number>`found_user.id`,
            username: sql<string>`found_user.username`,
            email: sql<string>`found_user.email`,
          },
        })
        .from(matches)
        .innerJoin(items, eq(matches.lostItemId, items.id))
        .innerJoin(sql`items as found_item`, eq(matches.foundItemId, sql`found_item.id`))
        .innerJoin(sql`users as lost_user`, eq(items.userId, sql`lost_user.id`))
        .innerJoin(sql`users as found_user`, eq(sql`found_item.user_id`, sql`found_user.id`))
        .where(eq(matches.status, status))
        .orderBy(desc(matches.similarityScore)) as typeof query;
    }

    const results = await query;

    return NextResponse.json({
      success: true,
      matches: results.map((r) => ({
        id: r.match.id,
        lostItemId: r.match.lostItemId,
        foundItemId: r.match.foundItemId,
        similarityScore: r.match.similarityScore,
        status: r.match.status,
        createdAt: r.match.createdAt,
        updatedAt: r.match.updatedAt,
        lostItem: r.lostItem,
        foundItem: r.foundItem,
        lostUser: r.lostUser,
        foundUser: r.foundUser,
      })),
    });
  } catch (error) {
    console.error("[Admin API] Error fetching matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}

// PATCH - Update match status (approve/reject)
export async function PATCH(req: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || sessionUser.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    matchId?: number;
    status?: "confirmed" | "rejected";
  } | null;

  if (!body?.matchId || !body?.status) {
    return NextResponse.json(
      { error: "Missing matchId or status" },
      { status: 400 }
    );
  }

  try {
    const [updatedMatch] = await db
      .update(matches)
      .set({ status: body.status })
      .where(eq(matches.id, body.matchId))
      .returning();

    if (!updatedMatch) {
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 }
      );
    }

    // Send notification to users about the match status update
    const { sendMatchStatusNotification } = await import("@/lib/notifications/notification-service");
    await sendMatchStatusNotification(updatedMatch, body.status);

    return NextResponse.json({
      success: true,
      message: `Match ${body.status === "confirmed" ? "approved" : "rejected"}`,
      match: updatedMatch,
    });
  } catch (error) {
    console.error("[Admin API] Error updating match:", error);
    return NextResponse.json(
      { error: "Failed to update match" },
      { status: 500 }
    );
  }
}

// POST - Trigger manual matching for an item
export async function POST(req: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || sessionUser.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    itemId?: number;
    itemType?: "lost" | "found";
  } | null;

  if (!body?.itemId || !body?.itemType) {
    return NextResponse.json(
      { error: "Missing itemId or itemType" },
      { status: 400 }
    );
  }

  try {
    const { processNewItemWithAI } = await import("@/lib/matching/enhanced-ai-matching");
    const results = await processNewItemWithAI(body.itemId, body.itemType);

    return NextResponse.json({
      success: true,
      message: `AI matching completed. Found ${results.length} potential matches.`,
      matches: results,
    });
  } catch (error) {
    console.error("[Admin API] Error running AI matching:", error);
    return NextResponse.json(
      { error: "Failed to run AI matching" },
      { status: 500 }
    );
  }
}