import axiosClient from "@/utils/constants/axiosClient";
import type { ApiResponse, MonitoredService } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

export function useMonitoredServices(params: Record<string, string | number>) {
  return useQuery<ApiResponse<MonitoredService>, Error>({
    queryKey: ["monitoredServices", params],
    queryFn: async () => {
      const query = new URLSearchParams(
        params as Record<string, string>
      ).toString();

      const { data } = await axiosClient.get(`/services?${query}`);
      return data;
    },
  });
}
