import type { ApiResponse } from "@/utils/types";

export type NotificationStatus =
  | "PENDING"
  | "SENT"
  | "FAILED";

export type NotificationHistory = {
  notification_history_id: number;

  subject: string;
  message: string;

  recipient: string;
  status: NotificationStatus;
  error_message: string | null;

  notification_channel_id: number;
  contact_group_id: number | null;

  user_id: number;
  service_id: number;

  include_pdf: boolean;
  pdf_template_id: number | null;
  pdf_generated_at: string | null;
  pdf_file_hash: string | null;
  pdf_file_path: string | null;

  sent_at: string | null;
  date_created: string;
  date_modified: string;
};

export type NotificationHistoryResponse =
  ApiResponse<NotificationHistory>;
