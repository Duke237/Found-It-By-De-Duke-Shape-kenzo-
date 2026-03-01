"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface UseSocketOptions {
  userId?: string | number;
  email?: string;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onNotification?: (data: Record<string, unknown>) => void;
  onNewItem?: (data: Record<string, unknown>) => void;
}

export function useSocket({
  userId,
  email,
  onConnect,
  onDisconnect,
  onNotification,
  onNewItem,
}: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Only connect if we have a userId
    if (!userId) {
      return;
    }

    // Initialize socket connection
    const socket = io(
      process.env.NEXT_PUBLIC_APP_URL || window.location.origin,
      {
        path: "/api/socketio",
        transports: ["websocket", "polling"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    );

    socketRef.current = socket;

    // Connection events
    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket.id);
      setIsConnected(true);
      setConnectionError(null);

      // Authenticate the socket
      if (userId && email) {
        socket.emit("authenticate", { userId: String(userId), email });
        socket.emit("join-user-room", String(userId));
        socket.emit("join-broadcast");
      }

      onConnect?.();
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
      setIsConnected(false);
      onDisconnect?.(reason);
    });

    socket.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error.message);
      setConnectionError(error.message);
    });

    // Notification events
    socket.on("notification", (data) => {
      console.log("[Socket] Received notification:", data);
      onNotification?.(data);
    });

    socket.on("new-item", (data) => {
      console.log("[Socket] New item reported:", data);
      onNewItem?.(data);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, email, onConnect, onDisconnect, onNotification, onNewItem]);

  // Helper to emit events
  const emit = useCallback(
    (event: string, data: unknown) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit(event, data);
        return true;
      }
      return false;
    },
    []
  );

  return {
    isConnected,
    connectionError,
    emit,
  };
}

/**
 * Hook for notification badge counter with real-time updates
 */
export function useNotificationCount(userId?: string | number) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch initial count
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchCount = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error("Failed to fetch notification count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, [userId]);

  // Listen for real-time updates
  const handleNotification = useCallback((data: Record<string, unknown>) => {
    if (data.isRead === false) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  useSocket({
    userId,
    onNotification: handleNotification,
  });

  // Function to decrement count
  const decrementCount = useCallback(() => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Function to clear count
  const clearCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return {
    unreadCount,
    loading,
    decrementCount,
    clearCount,
    setUnreadCount,
  };
}