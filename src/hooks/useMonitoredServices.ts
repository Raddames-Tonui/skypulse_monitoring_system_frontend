import axiosClient from "@/utils/constants/axiosClient";
import type { ApiResponse, MonitoredService } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

export function useMonitoredService(uuid: string) {
  return useQuery<ApiResponse<MonitoredService>, Error>({
    queryKey: ["monitoredService", uuid],
    queryFn: async () => {
      const params = new URLSearchParams({ uuid }).toString();
      const { data } = await axiosClient.get(`/services?${params}`);
      return data;
    },
    enabled: !!uuid, 
  });
}
