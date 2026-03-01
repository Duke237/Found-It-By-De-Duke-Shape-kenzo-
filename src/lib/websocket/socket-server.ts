import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";

// Extend NextApiResponse to include socket server
type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

let io: SocketIOServer | null = null;

/**
 * Initialize Socket.io server
 * This is called once to set up the WebSocket server
 */
export function initSocketServer(res: NextApiResponseServerIO): SocketIOServer {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.io server...");
    
    const httpServer: NetServer = res.socket.server;
    const ioServer = new SocketIOServer(httpServer, {
      path: "/api/socketio",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      transports: ["websocket", "polling"],
    });

    // Store the io instance
    io = ioServer;
    res.socket.server.io = ioServer;

    // Handle connections
    ioServer.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      // Join user to their personal room for targeted notifications
      socket.on("join-user-room", (userId: string) => {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} joined their room`);
      });

      // Join broadcast room for general notifications
      socket.on("join-broadcast", () => {
        socket.join("broadcast");
        console.log(`Socket ${socket.id} joined broadcast room`);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    console.log("Socket.io server initialized successfully");
  }

  return res.socket.server.io;
}

/**
 * Get the global io instance
 * Use this to emit events from anywhere in the app
 */
export function getIO(): SocketIOServer | null {
  return io;
}

/**
 * Set the global io instance
 * Used when initializing from API routes
 */
export function setIO(socketServer: SocketIOServer) {
  io = socketServer;
}

/**
 * Emit a notification to a specific user
 */
export function emitToUser(userId: string | number, event: string, data: unknown) {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
    console.log(`Emitted ${event} to user:${userId}`);
  } else {
    console.warn("Socket.io not initialized, cannot emit to user");
  }
}

/**
 * Emit a broadcast notification to all connected users
 */
export function emitBroadcast(event: string, data: unknown) {
  if (io) {
    io.to("broadcast").emit(event, data);
    console.log(`Broadcasted ${event} to all users`);
  } else {
    console.warn("Socket.io not initialized, cannot broadcast");
  }
}

/**
 * Emit to all connected sockets
 */
export function emitToAll(event: string, data: unknown) {
  if (io) {
    io.emit(event, data);
    console.log(`Emitted ${event} to all connected sockets`);
  } else {
    console.warn("Socket.io not initialized, cannot emit");
  }
}