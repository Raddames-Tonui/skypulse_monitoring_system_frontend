import { useEffect, useState } from "react";
import { CONFIG } from "@/utils/constants/Constants";
import type { SSEPayload, SystemHealth } from "@/utils/types";

const defaultSystemHealth: SystemHealth = {
  app: "—",
  version: "—",
  environment: "—",
  uptime_seconds: 0,
  timestamp: new Date().toISOString(),
  database: "—",
  database_status: "disconnected",
  sse_push_interval_seconds: 5,
};

export function useSystemHealthSSE(path: string = "/sse/health") {
  const [data, setData] = useState<SystemHealth>(defaultSystemHealth);

  useEffect(() => {
    const url = `${CONFIG.BASE_API_URL}${path}`;
    const evtSource = new EventSource(url);

    evtSource.onmessage = (event) => {
      try {
        const parsed: SystemHealth = JSON.parse(event.data);
        setData(parsed);
      } catch (e) {
        console.error("[SystemHealthSSE] Invalid JSON:", e);
      }
    };

    evtSource.onerror = (err) => {
      console.error("[SystemHealthSSE] SSE connection error:", err);
      evtSource.close();
    };

    return () => evtSource.close();
  }, [path]);

  return data;
}

const defaultSSEPayload: SSEPayload = {
  timestamp: new Date().toISOString(),
  total_services: 0,
  up_count: 0,
  down_count: 0,
  ssl_warnings: 0,
  ssl_critical: 0,
  ssl_severe: 0,
  services: [],
  sse_push_interval_seconds: 5,
};

export function useServiceStatusSSE(path: string = "/sse/service-status") {
  const [data, setData] = useState<SSEPayload>(defaultSSEPayload);

  useEffect(() => {
    const url = `${CONFIG.BASE_API_URL}${path}`;
    const evtSource = new EventSource(url);

    evtSource.onmessage = (event) => {
      try {
        const parsed: SSEPayload = JSON.parse(event.data);
        setData(parsed);
      } catch (e) {
        console.error("[ServiceStatusSSE] Invalid JSON:", e);
      }
    };

    evtSource.onerror = (err) => {
      console.error("[ServiceStatusSSE] SSE connection error:", err);
      evtSource.close();
    };

    return () => evtSource.close();
  }, [path]);

  return data;
}