
// ----------- NOTIFICATION TEMPLATES -----------

import type { ApiResponse } from "@/utils/types";

export type NotificationTemplate = {
  notification_template_id: number;
  uuid: string;

  event_type:
    | "SERVICE_DOWN"
    | "SERVICE_RECOVERED"
    | "SSL_EXPIRED"
    | "USER_CREATED"
    | "RESET_PASSWORD";

  subject_template: string;
  template_syntax: "mustache" | "handlebars" | "liquid";

  body_template: string;
  body_template_key: string;

  pdf_template: string | null;
  pdf_template_key: string | null;
  include_pdf: boolean;

  storage_mode: "DB" | "FILE" | "HYBRID";

  sample_data: Record<string, any>;

  created_by: string | null;

  date_created: string;   
  date_modified: string; 
};


// ----------- RESPONSE TYPE -----------

export type NotificationTemplateResponse =
  ApiResponse<NotificationTemplate>;