import axiosClient from "@/utils/constants/axiosClient";
import { useQuery } from "@tanstack/react-query";
import type { ApiError } from "@/utils/types";
import type {
  NotificationTemplatesResponse,
  NotificationTemplateResponse,
} from "@/pages/templates/data-access/types";


const fetchNotificationTemplates = async (): Promise<NotificationTemplatesResponse> => {
  const { data } =
      await axiosClient.get<NotificationTemplatesResponse>(
          "/notifications/templates"
      );
  return data;
};

export const useFetchTemplates = () =>
    useQuery<NotificationTemplatesResponse, ApiError>({
      queryKey: ["notification-templates"],
      queryFn: fetchNotificationTemplates,
      staleTime: 5 * 60 * 1000,
    });


const fetchNotificationTemplate = async (
    uuid: string
): Promise<NotificationTemplateResponse> => {
  const { data } =
      await axiosClient.get<NotificationTemplateResponse>(
          `/notifications/template/${uuid}`
      );
  return data;
};

export const useFetchTemplate = (uuid?: string) =>
    useQuery<NotificationTemplateResponse, ApiError>({
      queryKey: ["notification-template", uuid],
      queryFn: () => fetchNotificationTemplate(uuid as string),
      enabled: Boolean(uuid),
      staleTime: 5 * 60 * 1000,
    });
