import { Queue, Worker, Job } from "bullmq";
import { processNewItemWithAI } from "@/lib/matching/enhanced-ai-matching";
import {
  createNotification,
  broadcastNotification,
} from "@/lib/notifications/notification-service";
import { emitToUser, emitBroadcast } from "@/app/api/socketio/route";

// Redis connection configuration
const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // Required for BullMQ
};

// Job types
export type JobType =
  | "process-item-matching"
  | "send-broadcast-notification"
  | "send-targeted-notification"
  | "process-image-analysis";

// Job data interfaces
interface ProcessItemMatchingData {
  itemId: number;
  itemType: "lost" | "found";
  userId: number;
  title: string;
  location: string;
}

interface SendBroadcastNotificationData {
  excludeUserId: number;
  title: string;
  message: string;
  itemId: number;
  itemType: "lost" | "found";
}

interface SendTargetedNotificationData {
  userId: number;
  type: "match_found" | "submission_status" | "system";
  title: string;
  message: string;
  itemId?: number;
  matchScore?: number;
}

// Union type for all job data
export type JobData =
  | ProcessItemMatchingData
  | SendBroadcastNotificationData
  | SendTargetedNotificationData;

// Create queues
export const matchingQueue = new Queue("matching", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

export const notificationQueue = new Queue("notification", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "fixed",
      delay: 3000,
    },
    removeOnComplete: 200,
    removeOnFail: 100,
  },
});

// Initialize workers
let matchingWorker: Worker | null = null;
let notificationWorker: Worker | null = null;

/**
 * Initialize background job workers
 * Call this once when the server starts
 */
export function initializeWorkers() {
  if (matchingWorker || notificationWorker) {
    console.log("[Job Queue] Workers already initialized");
    return;
  }

  console.log("[Job Queue] Initializing background workers...");

  // Matching worker - handles AI matching jobs
  matchingWorker = new Worker(
    "matching",
    async (job: Job) => {
      const data = job.data as ProcessItemMatchingData;
      console.log(`[Matching Worker] Processing item ${data.itemId}`);

      try {
        // Run AI matching
        const matches = await processNewItemWithAI(data.itemId, data.itemType);

        console.log(
          `[Matching Worker] Found ${matches.length} matches for item ${data.itemId}`
        );

        return {
          success: true,
          itemId: data.itemId,
          matchesFound: matches.length,
          matches: matches.map((m) => ({
            score: m.similarityScore,
            lostItemId: m.lostItemId,
            foundItemId: m.foundItemId,
          })),
        };
      } catch (error) {
        console.error(
          `[Matching Worker] Error processing item ${data.itemId}:`,
          error
        );
        throw error;
      }
    },
    { connection: redisConnection }
  );

  matchingWorker.on("completed", (job) => {
    console.log(`[Matching Worker] Job ${job.id} completed`);
  });

  matchingWorker.on("failed", (job, err) => {
    console.error(`[Matching Worker] Job ${job?.id} failed:`, err);
  });

  // Notification worker - handles notification jobs
  notificationWorker = new Worker(
    "notification",
    async (job: Job) => {
      const data = job.data as
        | SendBroadcastNotificationData
        | SendTargetedNotificationData;

      if ("excludeUserId" in data) {
        // Broadcast notification
        console.log(`[Notification Worker] Sending broadcast notification`);

        // Save to database
        await broadcastNotification(
          data.excludeUserId,
          data.title,
          data.message,
          data.itemId
        );

        // Emit real-time notification
        emitBroadcast("new-item", {
          type: data.itemType,
          title: data.title,
          message: data.message,
          itemId: data.itemId,
          timestamp: new Date().toISOString(),
        });

        return { success: true, type: "broadcast" };
      } else {
        // Targeted notification
        console.log(
          `[Notification Worker] Sending targeted notification to user ${data.userId}`
        );

        // Save to database
        const notification = await createNotification({
          userId: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          itemId: data.itemId,
        });

        // Emit real-time notification
        emitToUser(data.userId, "notification", {
          ...notification,
          matchScore: (data as SendTargetedNotificationData).matchScore,
          timestamp: new Date().toISOString(),
        });

        return { success: true, type: "targeted", notificationId: notification.id };
      }
    },
    { connection: redisConnection }
  );

  notificationWorker.on("completed", (job) => {
    console.log(`[Notification Worker] Job ${job.id} completed`);
  });

  notificationWorker.on("failed", (job, err) => {
    console.error(`[Notification Worker] Job ${job?.id} failed:`, err);
  });

  console.log("[Job Queue] Background workers initialized");
}

/**
 * Add a job to process AI matching for a new item
 */
export async function queueItemMatching(data: ProcessItemMatchingData) {
  console.log(`[Job Queue] Adding matching job for item ${data.itemId}`);
  const job = await matchingQueue.add("process-item-matching", data, {
    priority: 1,
    delay: 100, // Small delay to allow transaction to commit
  });
  return job.id;
}

/**
 * Add a job to send broadcast notification
 */
export async function queueBroadcastNotification(
  data: SendBroadcastNotificationData
) {
  console.log(`[Job Queue] Adding broadcast notification job`);
  const job = await notificationQueue.add("send-broadcast-notification", data, {
    priority: 2,
  });
  return job.id;
}

/**
 * Add a job to send targeted notification
 */
export async function queueTargetedNotification(
  data: SendTargetedNotificationData
) {
  console.log(`[Job Queue] Adding targeted notification to user ${data.userId}`);
  const job = await notificationQueue.add("send-targeted-notification", data, {
    priority: 1,
  });
  return job.id;
}

/**
 * Get queue status
 */
export async function getQueueStatus() {
  const [matchingWaiting, matchingActive, matchingCompleted, matchingFailed] =
    await Promise.all([
      matchingQueue.getWaitingCount(),
      matchingQueue.getActiveCount(),
      matchingQueue.getCompletedCount(),
      matchingQueue.getFailedCount(),
    ]);

  const [
    notificationWaiting,
    notificationActive,
    notificationCompleted,
    notificationFailed,
  ] = await Promise.all([
    notificationQueue.getWaitingCount(),
    notificationQueue.getActiveCount(),
    notificationQueue.getCompletedCount(),
    notificationQueue.getFailedCount(),
  ]);

  return {
    matching: {
      waiting: matchingWaiting,
      active: matchingActive,
      completed: matchingCompleted,
      failed: matchingFailed,
    },
    notification: {
      waiting: notificationWaiting,
      active: notificationActive,
      completed: notificationCompleted,
      failed: notificationFailed,
    },
  };
}

/**
 * Clean up queues and workers
 */
export async function closeQueues() {
  console.log("[Job Queue] Closing queues and workers...");

  if (matchingWorker) {
    await matchingWorker.close();
    matchingWorker = null;
  }

  if (notificationWorker) {
    await notificationWorker.close();
    notificationWorker = null;
  }

  await matchingQueue.close();
  await notificationQueue.close();

  console.log("[Job Queue] Queues and workers closed");
}