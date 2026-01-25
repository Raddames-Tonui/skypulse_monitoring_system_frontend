import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import toast from "react-hot-toast";
import type { NotificationTemplate } from "./types";

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<NotificationTemplate> & { template_id: number }) => {
      const response = await axiosClient.put(
          `/notifications/template/${payload.template_id}`,
          payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Template updated successfully");

      ["notification-template", "notification-templates"].forEach((key) =>
          queryClient.invalidateQueries({ queryKey: [key] })
      );
    },
    onError: (error: any) => {
      const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update template";
      toast.error(message);
    },
  });
};
