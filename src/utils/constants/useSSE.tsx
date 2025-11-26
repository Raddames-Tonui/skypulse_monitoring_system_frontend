import { useEffect, useState } from "react";
import { CONFIG } from "@/utils/constants/Constants";

export function useSSE<T>(path: string) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const url = `${CONFIG.BASE_API_URL}${path}`;

    const evtSource = new EventSource(url);

    evtSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setData(parsed);
      } catch (e) {
        console.error("Invalid SSE JSON:", e);
      }
    };

    evtSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      evtSource.close();
    };

    return () => evtSource.close();
  }, [path]);

  return data;
}
