import axiosClient from "@/utils/constants/axiosClient";
import type { ApiResponse } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import type {MonitoredService} from "@/pages/services/data-access/useFetchData.tsx";

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