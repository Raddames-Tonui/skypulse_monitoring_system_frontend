import { AuthContext } from "@/context/AuthContext";
import type { AuthContextType } from "@/context/types";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/utils/constants/axiosClient';
import type { ApiError, ApiResponse, Users } from "@/utils/types";
import type { MonitoredService } from "@/utils/types";
import toast from "react-hot-toast";


export const useUsers = (params: Record<string, string | number | boolean>) => {
  return useQuery<ApiResponse<Users>, ApiError>({
    queryKey: ["users", params],
    queryFn: async () => {
      const { data } = await axiosClient.get<ApiResponse<Users>>("/users", { params });
      return data;
    },
  });
};

export const useMonitoredServices = (
  params: Record<string, string | number | boolean>
) => {
  return useQuery<ApiResponse<MonitoredService[]>, ApiError>({
    queryKey: ["monitoredServices", params],
    queryFn: async () => {
      const { data } = await axiosClient.get<ApiResponse<MonitoredService[]>>(
        "/services",
        { params }
      );
      return data;
    },
  });
};


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
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
