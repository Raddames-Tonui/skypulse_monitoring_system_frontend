import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";

export interface ApiResponse {
  message: string;
  status?: "success" | "error";
}

export function useSystemSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const res = await axiosClient.get<ApiResponse & Record<string, any>>("/settings");
      return {
        ...res.data,
        ssl_alert_thresholds: res.data.ssl_alert_thresholds
          ? res.data.ssl_alert_thresholds.split(",").map((v: string) => v.trim())
          : [],
      };
    },
  });

  return { ...query, queryClient };
}
