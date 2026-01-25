export type TemplateSyntax = "mustache" ;

export type StorageMode = 'HYBRID'  | 'FILESYSTEM' | 'DATABASE';

export type NotificationEventType =
    | "SERVICE_DOWN"
    | "SERVICE_RECOVERED"
    | "SSL_EXPIRED"
    | "USER_CREATED"
    | "RESET_PASSWORD"
    | "WEEKLY_REPORTS";

export interface TemplateCreator {
  id: number | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

export interface TemplatePlaceholder {
  placeholder_key: string;
  description?: string | null;
}

export interface NotificationTemplate {
  uuid: string;
  notification_template_id: number;
  subject_template: string;
  body_template?: string | null;
  pdf_template?: string | null;
  include_pdf?: boolean;
  body_template_key?: string | null;
  pdf_template_key?: string | null;
  template_syntax?: TemplateSyntax;
  storage_mode?: StorageMode;
  event_type: NotificationEventType;

  created_by: TemplateCreator | null;
  placeholders?: TemplatePlaceholder[];

  date_created: string;
  date_modified: string;
}

export interface NotificationTemplatesResponse {
  data: NotificationTemplate[];
  current_page: number;
  last_page: number;
  page_size: number;
  total_count: number;
  domain: string;
}

export interface NotificationTemplateResponse {
  data: NotificationTemplate;
  message: string;
}
