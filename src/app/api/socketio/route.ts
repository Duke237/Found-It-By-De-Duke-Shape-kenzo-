import { NextResponse } from "next/server";
import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { getSessionUser } from "@/lib/auth/session";

// Extend the NodeJS global type to include our io instance
declare global {
  var io: SocketIOServer | undefined;
}

// Store io instance globally
let io: SocketIOServer | null = null;

/**
 * GET handler for Socket.io initialization
 * This endpoint initializes the WebSocket server
 */
export async function GET() {
  // Check authentication for socket connection
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Return success - Socket.io will be initialized separately
  return NextResponse.json({ 
    success: true, 
    message: "Socket.io endpoint ready",
    user: sessionUser.email 
  });
}

/**
 * Initialize Socket.io server on a raw HTTP server
 * This is used by the custom server setup
 */
export function initSocketIO(httpServer: NetServer): SocketIOServer {
  if (!io) {
    console.log("Initializing Socket.io server...");
    
    io = new SocketIOServer(httpServer, {
      path: "/api/socketio",
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    // Store globally for access from other parts of the app
    globalThis.io = io;

    // Handle connections
    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      // Authenticate socket connection
      socket.on("authenticate", (data: { userId: string; email: string }) => {
        socket.data.userId = data.userId;
        socket.data.email = data.email;
        socket.join(`user:${data.userId}`);
        console.log(`Socket ${socket.id} authenticated as user:${data.userId}`);
      });

      // Join user-specific room for targeted notifications
      socket.on("join-user-room", (userId: string) => {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} joined their notification room`);
      });

      // Join broadcast room for general notifications
      socket.on("join-broadcast", () => {
        socket.join("broadcast");
        console.log(`Socket ${socket.id} joined broadcast room`);
      });

      // Handle disconnection
      socket.on("disconnect", (reason) => {
        console.log("Client disconnected:", socket.id, "Reason:", reason);
      });

      // Handle errors
      socket.on("error", (error) => {
        console.error("Socket error:", socket.id, error);
      });
    });

    console.log("Socket.io server initialized successfully");
  }

  return io;
}

/**
 * Get the global io instance
 */
export function getSocketIO(): SocketIOServer | null {
  return io || globalThis.io || null;
}

/**
 * Emit a notification to a specific user
 */
export function emitToUser(userId: string | number, event: string, data: unknown) {
  const socketIO = getSocketIO();
  if (socketIO) {
    socketIO.to(`user:${userId}`).emit(event, data);
    console.log(`[Socket] Emitted ${event} to user:${userId}`);
    return true;
  }
  console.warn("[Socket] Socket.io not initialized, cannot emit to user");
  return false;
}

/**
 * Emit a broadcast notification to all users in broadcast room
 */
export function emitBroadcast(event: string, data: unknown) {
  const socketIO = getSocketIO();
  if (socketIO) {
    socketIO.to("broadcast").emit(event, data);
    console.log(`[Socket] Broadcasted ${event} to all users`);
    return true;
  }
  console.warn("[Socket] Socket.io not initialized, cannot broadcast");
  return false;
}

/**
 * Emit to all connected sockets
 */
export function emitToAll(event: string, data: unknown) {
  const socketIO = getSocketIO();
  if (socketIO) {
    socketIO.emit(event, data);
    console.log(`[Socket] Emitted ${event} to all connected sockets`);
    return true;
  }
  console.warn("[Socket] Socket.io not initialized, cannot emit");
  return false;
}