import { db } from "@/db";
import { items, matches, users } from "@/db/schema";
import { eq, and, ne, sql } from "drizzle-orm";
import { emitToUser, emitBroadcast } from "@/app/api/socketio/route";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Configuration
const MATCH_THRESHOLD = 0.75; // 75% similarity threshold
const MAX_MATCHES_TO_STORE = 10;

export interface EnhancedMatchResult {
  lostItemId: number;
  foundItemId: number;
  similarityScore: number;
  textSimilarity: number;
  categoryMatch: boolean;
  locationSimilarity: number;
  dateSimilarity: number;
  imageSimilarity?: number;
  confidenceFactors: {
    descriptionWeight: number;
    categoryWeight: number;
    locationWeight: number;
    dateWeight: number;
    imageWeight: number;
  };
}

/**
 * Generate text embeddings using OpenAI
 */
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text.slice(0, 8000), // Limit input size
      encoding_format: "float",
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    // Return empty embedding as fallback
    return new Array(1536).fill(0);
  }
}

/**
 * Calculate cosine similarity between two embeddings
 */
function cosineSimilarity(embedding1: number[], embedding2: number[]): number {
  if (embedding1.length !== embedding2.length) {
    return 0;
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    norm1 += embedding1[i] * embedding1[i];
    norm2 += embedding2[i] * embedding2[i];
  }

  if (norm1 === 0 || norm2 === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

/**
 * Calculate text similarity using OpenAI embeddings
 */
async function calculateSemanticSimilarity(
  text1: string,
  text2: string
): Promise<number> {
  try {
    const [embedding1, embedding2] = await Promise.all([
      generateEmbedding(text1),
      generateEmbedding(text2),
    ]);

    return cosineSimilarity(embedding1, embedding2);
  } catch (error) {
    console.error("Error calculating semantic similarity:", error);
    // Fallback to simple text similarity
    return calculateSimpleTextSimilarity(text1, text2);
  }
}

/**
 * Simple text similarity as fallback (Levenshtein-based)
 */
function calculateSimpleTextSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;

  // Word overlap similarity
  const words1 = new Set(s1.split(/\s+/));
  const words2 = new Set(s2.split(/\s+/));
  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

/**
 * Calculate date proximity similarity
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
 * Calculate location similarity using text comparison and common location patterns
 */
function calculateLocationSimilarity(loc1: string, loc2: string): number {
  const normalized1 = loc1.toLowerCase().trim();
  const normalized2 = loc2.toLowerCase().trim();

  // Exact match
  if (normalized1 === normalized2) return 1.0;

  // One contains the other
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1))
    return 0.85;

  // Extract potential location components (city, area, building)
  const components1 = normalized1.split(/[,\s]+/);
  const components2 = normalized2.split(/[,\s]+/);

  // Check for common components
  const commonComponents = components1.filter((c) =>
    components2.some((c2) => c2.includes(c) || c.includes(c2))
  );

  const similarity = commonComponents.length / Math.max(components1.length, components2.length);
  return Math.max(0.3, similarity);
}

/**
 * Calculate image similarity (placeholder for Google Vision API integration)
 * Returns a score between 0 and 1
 */
async function calculateImageSimilarity(
  imageUrl1: string | null,
  imageUrl2: string | null
): Promise<number> {
  // If no images, return neutral score
  if (!imageUrl1 || !imageUrl2) {
    return 0.5;
  }

  // TODO: Implement Google Vision API integration
  // For now, return a neutral score that doesn't affect the overall match
  // This can be enhanced with:
  // 1. Google Vision API label detection
  // 2. Color histogram comparison
  // 3. Feature extraction and comparison

  // Placeholder: Assume images are somewhat similar if both exist
  return 0.6;
}

/**
 * Main enhanced AI matching algorithm
 * Uses OpenAI embeddings for semantic similarity
 */
export async function findEnhancedMatches(
  newItemId: number,
  itemType: "lost" | "found"
): Promise<EnhancedMatchResult[]> {
  console.log(`[AI Matching] Processing ${itemType} item ${newItemId}`);

  // Get the newly submitted item
  const [newItem] = await db
    .select()
    .from(items)
    .where(eq(items.id, newItemId));

  if (!newItem) {
    console.error(`[AI Matching] Item ${newItemId} not found`);
    return [];
  }

  // Generate embedding for the new item
  const newItemText = `${newItem.title} ${newItem.description} ${newItem.category}`;
  const newItemEmbedding = await generateEmbedding(newItemText);

  // Update item with embedding
  await db
    .update(items)
    .set({ embedding: JSON.stringify(newItemEmbedding) })
    .where(eq(items.id, newItemId));

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

  console.log(
    `[AI Matching] Found ${potentialMatches.length} potential ${searchType} items to compare`
  );

  const results: EnhancedMatchResult[] = [];

  for (const candidate of potentialMatches) {
    // Parse candidate embedding if available
    let candidateEmbedding: number[] | null = null;
    if (candidate.embedding) {
      try {
        candidateEmbedding = JSON.parse(candidate.embedding);
      } catch {
        // Invalid embedding, will generate new one
      }
    }

    // Generate embedding if not available
    if (!candidateEmbedding) {
      const candidateText = `${candidate.title} ${candidate.description} ${candidate.category}`;
      candidateEmbedding = await generateEmbedding(candidateText);
      // Store for future use
      await db
        .update(items)
        .set({ embedding: JSON.stringify(candidateEmbedding) })
        .where(eq(items.id, candidate.id));
    }

    // Calculate semantic similarity using embeddings
    const semanticSimilarity = cosineSimilarity(
      newItemEmbedding,
      candidateEmbedding
    );

    // Category match (binary: 1 if match, 0 if not)
    const categoryMatch = newItem.category === candidate.category;
    const categoryScore = categoryMatch ? 1.0 : 0.0;

    // Date proximity
    const dateSimilarity = calculateDateSimilarity(
      new Date(newItem.date),
      new Date(candidate.date)
    );

    // Location similarity
    const locationSimilarity = calculateLocationSimilarity(
      newItem.location,
      candidate.location
    );

    // Image similarity (async)
    const imageSimilarity = await calculateImageSimilarity(
      newItem.imageUrl,
      candidate.imageUrl
    );

    // Weight configuration
    const weights = {
      description: 0.35, // Semantic similarity weight
      category: 0.25, // Category match weight
      location: 0.2, // Location similarity weight
      date: 0.1, // Date proximity weight
      image: 0.1, // Image similarity weight
    };

    // Calculate weighted score
    const weightedScore =
      semanticSimilarity * weights.description +
      categoryScore * weights.category +
      locationSimilarity * weights.location +
      dateSimilarity * weights.date +
      imageSimilarity * weights.image;

    console.log(
      `[AI Matching] Item ${candidate.id}: Score=${weightedScore.toFixed(3)}, Semantic=${semanticSimilarity.toFixed(3)}, Category=${categoryMatch}`
    );

    // Only include matches above threshold
    if (weightedScore >= MATCH_THRESHOLD) {
      const matchResult: EnhancedMatchResult = {
        lostItemId: itemType === "lost" ? newItemId : candidate.id,
        foundItemId: itemType === "found" ? newItemId : candidate.id,
        similarityScore: weightedScore,
        textSimilarity: semanticSimilarity,
        categoryMatch,
        locationSimilarity,
        dateSimilarity,
        imageSimilarity,
        confidenceFactors: {
          descriptionWeight: weights.description,
          categoryWeight: weights.category,
          locationWeight: weights.location,
          dateWeight: weights.date,
          imageWeight: weights.image,
        },
      };

      results.push(matchResult);

      // Save match to database
      await db.insert(matches).values({
        lostItemId: matchResult.lostItemId,
        foundItemId: matchResult.foundItemId,
        similarityScore: weightedScore,
        status: "pending",
      });

      console.log(
        `[AI Matching] ✅ Match found: ${newItemId} <-> ${candidate.id} (${(weightedScore * 100).toFixed(1)}%)`
      );
    }
  }

  // Sort by similarity score (highest first)
  results.sort((a, b) => b.similarityScore - a.similarityScore);

  console.log(
    `[AI Matching] Completed. Found ${results.length} matches above ${(MATCH_THRESHOLD * 100).toFixed(0)}% threshold`
  );

  return results;
}

/**
 * Process a new item submission with enhanced AI matching
 * This is the main entry point called after item creation
 */
export async function processNewItemWithAI(
  itemId: number,
  itemType: "lost" | "found"
): Promise<EnhancedMatchResult[]> {
  console.log(`[AI Matching] Starting AI processing for ${itemType} item ${itemId}`);

  try {
    // Find matches using enhanced algorithm
    const matches = await findEnhancedMatches(itemId, itemType);

    // Get item details for notifications
    const [item] = await db.select().from(items).where(eq(items.id, itemId));
    if (!item) {
      throw new Error(`Item ${itemId} not found`);
    }

    // Get the user who submitted the item
    const [submitter] = await db
      .select()
      .from(users)
      .where(eq(users.id, item.userId));

    // Send real-time notifications for each match
    for (const match of matches) {
      // Determine which user to notify
      const matchedItemId =
        itemType === "lost" ? match.foundItemId : match.lostItemId;
      const [matchedItem] = await db
        .select()
        .from(items)
        .where(eq(items.id, matchedItemId));

      if (matchedItem) {
        // Send targeted notification to the owner of the matched item
        const notificationData = {
          type: "match_found",
          title: `🔍 Potential Match Found! (${Math.round(match.similarityScore * 100)}% match)`,
          message: `We found a potential match for your ${itemType === "lost" ? "found" : "lost"} item "${matchedItem.title}". A ${itemType} item was reported that may belong to you!`,
          itemId: matchedItemId,
          matchScore: match.similarityScore,
          timestamp: new Date().toISOString(),
        };

        // Emit real-time notification
        emitToUser(matchedItem.userId, "notification", notificationData);

        console.log(
          `[AI Matching] 📧 Sent match notification to user:${matchedItem.userId}`
        );
      }
    }

    return matches;
  } catch (error) {
    console.error("[AI Matching] Error processing item:", error);
    throw error;
  }
}

/**
 * Get AI confidence explanation for a match
 */
export function getMatchExplanation(match: EnhancedMatchResult): string {
  const factors = [];

  if (match.textSimilarity > 0.8) {
    factors.push("Very similar descriptions");
  } else if (match.textSimilarity > 0.6) {
    factors.push("Somewhat similar descriptions");
  }

  if (match.categoryMatch) {
    factors.push("Same category");
  }

  if (match.locationSimilarity > 0.8) {
    factors.push("Same location");
  } else if (match.locationSimilarity > 0.5) {
    factors.push("Nearby location");
  }

  if (match.dateSimilarity > 0.8) {
    factors.push("Same date");
  } else if (match.dateSimilarity > 0.5) {
    factors.push("Close dates");
  }

  if (match.imageSimilarity && match.imageSimilarity > 0.7) {
    factors.push("Similar images");
  }

  return factors.length > 0
    ? factors.join(" • ")
    : "Based on overall similarity analysis";
}