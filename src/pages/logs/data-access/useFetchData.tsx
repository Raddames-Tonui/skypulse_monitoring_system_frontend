import axiosClient from "@/utils/constants/axiosClient";
import { useQuery } from "@tanstack/react-query";
import type { ApiError } from "@/utils/types";
import type { NotificationHistoryResponse } from "./types";

const fetchNotificationHistory =
  async (): Promise<NotificationHistoryResponse> => {
    const { data } =
      await axiosClient.get<NotificationHistoryResponse>(
        "/notifications/history"
      );
    return data;
  };

export const useFetchNotificationHistory = () => {
  return useQuery<NotificationHistoryResponse, ApiError>({
    queryKey: ["notification-history"],
    queryFn: fetchNotificationHistory,
    staleTime: 5 * 60 * 1000,
  });
};
