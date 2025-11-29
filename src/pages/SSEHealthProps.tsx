import React, { useEffect, useState } from "react";

interface SystemHealth {
  app: string;
  version: string;
  environment: string;
  uptime_seconds: number;
  timestamp: string;
  database: string;
  database_status: string;
  sse_push_interval_seconds: number;
}

export default function SSEHealth() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes || !parts.length) parts.push(`${minutes}m`);
    return parts.join(" ");
  };

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8000/api/rest/sse/health");

    eventSource.onmessage = (event) => {
      try {
        // Just parse event.data directly
        const data: SystemHealth = JSON.parse(event.data);
        setHealth(data);
      } catch (err) {
        console.error("Failed to parse SSE:", err);
        setError("Failed to parse SSE data");
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      setError("Failed to connect to SSE endpoint");
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!health) return <p>Loading...</p>;

  return (
    <div className="sse-health-card">
      <h3>{health.app}</h3>
      <p>Version: {health.version}</p>
      <p>Environment: {health.environment}</p>
      <p>Uptime: {formatUptime(health.uptime_seconds)}</p>
      <p>Database: {health.database}</p>
      <p style={{ color: health.database_status === "connected" ? "green" : "red" }}>
        DB Status: {health.database_status}
      </p>
      <p>SSE Interval: {health.sse_push_interval_seconds}s</p>
      <p>Last Updated: {new Date(health.timestamp).toLocaleTimeString()}</p>
    </div>
  );
}
