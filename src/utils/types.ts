
// ----------- GENERIC API RESPONSE -----------
export type ApiResponse<T> = {
  domain: string;
  current_page: number;
  last_page: number;
  page_size: number;
  total_count: number;
  records: T[];
};

export type ApiError = {
  message: string;
  code?: string;
  details?: any;
};

// ----------- MONITORED SERVICE TYPE -----------
export type MonitoredService = {
  id: number;
  uuid: string;
  monitored_service_name: string;
  monitored_service_url: string;
  monitored_service_region: string;
  check_interval: number | null;
  expected_status_code: number;
  created_by: number;
  retry_delay: number;
  retry_count: number;
  consecutive_failures: number;
  ssl_enabled: boolean;
  is_active: boolean;
  last_checked: string;        
  date_created: string;        
  date_modified: string;       
  last_uptime_status: "UP" | "DOWN" | "UNKNOWN";
};
