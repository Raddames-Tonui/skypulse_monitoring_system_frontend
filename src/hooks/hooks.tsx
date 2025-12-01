import { AuthContext } from "@/context/AuthContext";
import type { AuthContextType } from "@/context/types";
import { useCallback, useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/utils/constants/axiosClient';
import type { ApiError, ApiResponse, CreateUserPayload, CreateUserResponse, Users } from "@/utils/types";
import type { MonitoredService } from "@/utils/types";
import toast from "react-hot-toast";
import { saveAs } from "file-saver";


export const useUsers = (params: Record<string, string | number | boolean>) => {
  return useQuery<ApiResponse<Users>, ApiError>({
    queryKey: ["users", params],
    queryFn: async () => {
      const { data } = await axiosClient.get<ApiResponse<Users>>("/users", { params });
      return data;
    },
  });
};


export function useCreateUser() {
  return useMutation<CreateUserResponse, any, CreateUserPayload>({
    mutationFn: async (payload) => {
      const res = await axiosClient.post("/users/user/create", payload);
      return res.data;
    },
  });
}

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
      return axiosClient.put("/services/update", values);
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


export function useSslReportDownload() {
    const [isProcessing, setIsProcessing] = useState(false);

    const downloadReport = useCallback(async () => {
        try {
            setIsProcessing(true);

            const response = await axiosClient.get("/reports/pdf/ssl", {
                params: { period: 14 }, 
                responseType: "blob",
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            saveAs(blob, `ssl-report.pdf`);
        } catch (err) {
            console.error("Failed to download SSL report", err);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const previewReport = useCallback(async () => {
        try {
            setIsProcessing(true);

            const response = await axiosClient.get("/reports/pdf/ssl", {
                params: { period: 14 }, 
                responseType: "blob",
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
        } catch (err) {
            console.error("Failed to preview SSL report", err);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    return { isProcessing, downloadReport, previewReport };
}


export function useUptimeReportDownload() {
    const [isProcessing, setIsProcessing] = useState(false);

    const downloadReport = useCallback(async () => {
        try {
            setIsProcessing(true);

            const response = await axiosClient.get("/reports/pdf/uptime", {
                params: { period: 14, status: ["UP", "DOWN"] },
                responseType: "blob",
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            saveAs(blob, `uptime-report.pdf`);
        } catch (err) {
            console.error("Failed to download report", err);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const previewReport = useCallback(async () => {
        try {
            setIsProcessing(true);

            const response = await axiosClient.get("/reports/pdf/uptime", {
                params: { period: 14, status: ["UP", "DOWN"] },
                responseType: "blob",
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
        } catch (err) {
            console.error("Failed to preview report", err);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    return { isProcessing, downloadReport, previewReport };
}
