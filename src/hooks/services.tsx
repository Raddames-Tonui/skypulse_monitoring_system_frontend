import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import type { MonitoredService } from "@/utils/types";
import toast from "react-hot-toast";

interface MonitoredServicesResponse {
  data: MonitoredService[];
  total_count: number;
  current_page: number;
  page_size: number;
  last_page: number;
}

// --- Fetch services ---
export const useMonitoredServices = (params: Record<string, string | number>) => {
  return useQuery<MonitoredServicesResponse>({
    queryKey: ["monitored-services", params],
    queryFn: async () => {
      const { data } = await axiosClient.get("/services", { params });
      return data;
    },
  });
};

// --- Create service ---
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Record<string, any>) => {
      return axiosClient.post("/services/create", values);
    },
    onSuccess: () => {
      toast.success("Service created successfully");
      queryClient.invalidateQueries({ queryKey: ["monitored-services"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Failed to create monitored service";
      toast.error(message);
    },
  });
};


export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Record<string, any>) => {
      return axiosClient.put("/services", values);
    },
    onSuccess: (res) => {
      toast.success(res.data?.message || "Service updated successfully");
      queryClient.invalidateQueries({ queryKey: ["monitored-services"] });
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update service";

      toast.error(msg);
    },
  });
};