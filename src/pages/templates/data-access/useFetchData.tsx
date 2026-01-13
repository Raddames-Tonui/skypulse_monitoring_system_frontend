
import axiosClient from "@/utils/constants/axiosClient";
import type { NotificationTemplateResponse } from "./types";
import { useQuery } from "@tanstack/react-query";
import type { ApiError } from "@/utils/types";

/**
 * Fetch all notification templates
 */
const fetchNotificationTemplates = async (): Promise<NotificationTemplateResponse> => {
  const { data } = await axiosClient.get<NotificationTemplateResponse>("/notifications/templates");
  return data;
};

/**
 * Hook to get notification templates
 */
export const useFetchTemplates = () => {
  return useQuery<NotificationTemplateResponse, ApiError>({
    queryKey: ["notification-templates"],
    queryFn: fetchNotificationTemplates,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
