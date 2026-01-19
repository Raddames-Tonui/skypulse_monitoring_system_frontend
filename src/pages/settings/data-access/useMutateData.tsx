import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/pages/settings/data-access/useFetchData";

export function useSaveSettings(queryClient: any) {
  return useMutation({
    mutationFn: async (values: Record<string, any>) => {
      const payload = {
        ...values,
        ssl_alert_thresholds: Array.isArray(values.ssl_alert_thresholds)
          ? values.ssl_alert_thresholds.join(",")
          : values.ssl_alert_thresholds,
      };
      return axiosClient.post<ApiResponse>("/settings", payload);
    },
    onSuccess: () => {
      toast.success("Settings saved successfully");
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<ApiResponse>;
      const message = error.response?.data?.message || error.message || "Failed to save settings";
      toast.error(message);
    },
  });
}

export function useRollbackSettings(queryClient: any) {
  return useMutation({
    mutationFn: async () => axiosClient.post<ApiResponse>("/settings/rollback", { rollback: true }),
    onSuccess: async (res) => {
      if (res.data?.status === "error") {
        toast.error(res.data.message || "Rollback failed");
      } else {
        toast.success(res.data.message || "Settings reverted to previous version!");
        await queryClient.invalidateQueries({ queryKey: ["system-settings"] });
      }
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<ApiResponse>;
      const message = error.response?.data?.message || error.message || "Failed to revert settings";
      toast.error(message);
    },
  });
}

export function useRestartApplication() {
  return useMutation({
    mutationFn: async () => axiosClient.get<ApiResponse>("/system/tasks/reload"),
    onSuccess: (res) => {
      toast.success(res.data?.message || "Application restart initiated!");
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<ApiResponse>;
      const message = error.response?.data?.message || error.message || "Failed to restart application";
      toast.error(message);
    },
  });
}
