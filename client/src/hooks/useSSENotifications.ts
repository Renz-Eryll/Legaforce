import { useEffect, useRef, useCallback, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { notificationService } from "@/services/notificationService";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export interface SSENotification {
  id: string;
  type: "success" | "warning" | "info";
  title: string;
  message: string;
  date: string;
  read: boolean;
  status?: string;
  jobTitle?: string;
  companyName?: string;
  applicationId?: string;
  jobId?: string;
  matchScore?: number;
}

/**
 * Hook that establishes an SSE connection to receive real-time notifications.
 * Returns live notifications that can be merged with the polled notification list.
 */
export function useSSENotifications() {
  const { isAuthenticated } = useAuthStore();
  const eventSourceRef = useRef<EventSource | null>(null);
  const [liveNotifications, setLiveNotifications] = useState<SSENotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retriesRef = useRef(0);

  const connect = useCallback(() => {
    // Token lives in localStorage, NOT in the auth store
    const token = localStorage.getItem("auth_token");
    if (!isAuthenticated || !token) return;

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = `${API_BASE}/notifications/stream?token=${encodeURIComponent(token)}`;

    try {
      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.addEventListener("connected", () => {
        setIsConnected(true);
        retriesRef.current = 0;
        console.log("✅ SSE connected");
      });

      // Status change events (from employer/admin updating application status)
      es.addEventListener("status_change", (event) => {
        try {
          const data: SSENotification = JSON.parse(event.data);
          setLiveNotifications((prev) => [data, ...prev].slice(0, 30));

          // Also trigger browser push notification
          notificationService.notifyStatusChange(
            data.status || "",
            data.jobTitle || "",
            data.companyName || ""
          );
        } catch (err) {
          console.warn("Failed to parse SSE status_change:", err);
        }
      });

      // Job match events
      es.addEventListener("job_match", (event) => {
        try {
          const data: SSENotification = JSON.parse(event.data);
          setLiveNotifications((prev) => [data, ...prev].slice(0, 30));

          notificationService.notifyJobMatch(
            data.jobTitle || "",
            data.companyName || ""
          );
        } catch (err) {
          console.warn("Failed to parse SSE job_match:", err);
        }
      });

      // Generic notification events (from notification.service.js)
      es.addEventListener("notification", (event) => {
        try {
          const data: SSENotification = JSON.parse(event.data);
          setLiveNotifications((prev) => [data, ...prev].slice(0, 30));

          // Map backend notification type to icon category
          const type = data.type === "warning" ? "warning" : data.type === "success" ? "success" : "info";
          
          toast(data.title, {
            description: data.message,
          });
        } catch (err) {
          console.warn("Failed to parse SSE notification:", err);
        }
      });

      es.onerror = () => {
        setIsConnected(false);
        es.close();
        eventSourceRef.current = null;

        // Exponential backoff reconnection (max 60s)
        const delay = Math.min(1000 * Math.pow(2, retriesRef.current), 60000);
        retriesRef.current += 1;
        console.warn(`SSE disconnected — reconnecting in ${delay / 1000}s`);

        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, delay);
      };
    } catch (err) {
      console.warn("SSE connection failed:", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  const clearLiveNotifications = useCallback(() => {
    setLiveNotifications([]);
  }, []);

  return {
    liveNotifications,
    isConnected,
    clearLiveNotifications,
  };
}
