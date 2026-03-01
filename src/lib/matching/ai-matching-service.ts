import { db } from "@/db";
import { items, matches, users } from "@/db/schema";
import { eq, and, ne, inArray, or } from "drizzle-orm";
import { sendMatchNotification } from "@/lib/notifications/notification-service";

export interface MatchResult {
  lostItemId: number;
  foundItemId: number;
  similarityScore: number;
}

// Categories that can match
const MATCHABLE_CATEGORIES = [
  "Electronics",
  "Wallet/Purse",
  "Keys",
  "Documents",
  "Jewelry",
  "Clothing",
  "Bag/Luggage",
  "Other",
];

/**
 * Simple text similarity using Levenshtein distance concept
 */
function calculateTextSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Word overlap similarity
  const words1 = new Set(s1.split(/\s+/));
  const words2 = new Set(s2.split(/\s+/));
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Check if dates are within acceptable range (within 7 days)
 */
function calculateDateSimilarity(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date1.getTime() - date2.getTime());
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  if (diffDays === 0) return 1.0;
  if (diffDays <= 1) return 0.9;
  if (diffDays <= 3) return 0.7;
  if (diffDays <= 7) return 0.5;
  return Math.max(0, 1 - diffDays / 30);
}

/**
 * Check if locations are similar (same city/area)
 */
function calculateLocationSimilarity(loc1: string, loc2: string): number {
  return calculateTextSimilarity(loc1, loc2);
}

/**
 * Main AI similarity matching algorithm
 * Compares an item against all opposite-type items
 */
export async function findMatches(
  newItemId: number,
  itemType: "lost" | "found"
): Promise<MatchResult[]> {
  // Get the newly submitted item
  const [newItem] = await db.select().from(items).where(eq(items.id, newItemId));
  
  if (!newItem) {
    console.error(`Item ${newItemId} not found`);
    return [];
  }

  // Determine which type to search for (opposite of the new item)
  const searchType = itemType === "lost" ? "found" : "lost";

  // Get all items of the opposite type that are not rejected
  const potentialMatches = await db
    .select()
    .from(items)
    .where(
      and(
        eq(items.type, searchType),
        ne(items.status, "rejected"),
        ne(items.id, newItemId)
      )
    );

  const results: MatchResult[] = [];

  for (const candidate of potentialMatches) {
    let similarityScore = 0;
    let factors = 0;

    // Category match (highest weight)
    if (newItem.category === candidate.category) {
      similarityScore += 0.35;
    }
    factors += 0.35;

    // Description similarity
    const descSimilarity = calculateTextSimilarity(
      newItem.description,
      candidate.description
    );
    similarityScore += descSimilarity * 0.25;
    factors += 0.25;

    // Title similarity
    const titleSimilarity = calculateTextSimilarity(
      newItem.title,
      candidate.title
    );
    similarityScore += titleSimilarity * 0.2;
    factors += 0.2;

    // Date proximity
    const dateSimilarity = calculateDateSimilarity(
      new Date(newItem.date),
      new Date(candidate.date)
    );
    similarityScore += dateSimilarity * 0.1;
    factors += 0.1;

    // Location similarity
    const locationSimilarity = calculateLocationSimilarity(
      newItem.location,
      candidate.location
    );
    similarityScore += locationSimilarity * 0.1;
    factors += 0.1;

    // Normalize score
    const normalizedScore = factors > 0 ? similarityScore / factors : 0;

    // Only include matches with score >= 40%
    if (normalizedScore >= 0.4) {
      // Save match to database
      const [match] = await db
        .insert(matches)
        .values({
          lostItemId: itemType === "lost" ? newItemId : candidate.id,
          foundItemId: itemType === "found" ? newItemId : candidate.id,
          similarityScore: normalizedScore,
          status: "pending",
        })
        .returning();

      results.push({
        lostItemId: match.lostItemId,
        foundItemId: match.foundItemId,
        similarityScore: normalizedScore,
      });

      // Send targeted notification to the owner of the candidate item
      // Only notify if the match is strong (>= 60%)
      if (normalizedScore >= 0.6) {
        await sendMatchNotification(
          candidate.userId,
          itemType === "lost" ? candidate.id : newItemId,
          searchType,
          normalizedScore
        );
      }
    }
  }

  return results;
}

/**
 * Process a new item submission: find matches and send notifications
 * This is called after an item is successfully submitted
 */
export async function processNewItem(itemId: number, itemType: "lost" | "found") {
  console.log(`Processing new ${itemType} item: ${itemId}`);

  // Find potential matches
  const matches = await findMatches(itemId, itemType);

  console.log(`Found ${matches.length} potential matches for item ${itemId}`);

  return matches;
}

/**
 * Get all matches for a specific item
 */
export async function getMatchesForItem(itemId: number) {
  const itemMatches = await db
    .select()
    .from(matches)
    .where(
      and(
        eq(matches.lostItemId, itemId),
        eq(matches.status, "pending")
      )
    );

  return itemMatches;
}

/**
 * Get all matches for a user (items they reported)
 */
export async function getUserMatches(userId: number) {
  // Get all items user reported
  const userItems = await db
    .select({ id: items.id })
    .from(items)
    .where(eq(items.userId, userId));

  const userItemIds = userItems.map(i => i.id);

  if (userItemIds.length === 0) {
    return [];
  }

  // Get matches where user is the owner of either the lost or found item
  const userMatches = await db
    .select()
    .from(matches)
    .where(
      and(
        eq(matches.status, "pending"),
        or(
          inArray(matches.lostItemId, userItemIds),
          inArray(matches.foundItemId, userItemIds)
        )
      )
    );

  return userMatches;
}
