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

// ----------- USERS -----------
export interface User {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  user_email: string;
  role_name: string;
  company_name: string;
  is_active: boolean;
  date_created: string;
  date_modified: string;
}

export type UsersResponse = ApiResponse<User>;


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



// -------- SINGLE SERVICE --------------
export interface ServiceDataResponse {
  data: ServiceData;
}

// Core service data
export interface ServiceData {
  check_interval: number;
  is_active: boolean;
  date_created: string; 
  date_modified: string; 
  maintenance_windows: MaintenanceWindow[];
  expected_status_code: number;
  uuid: string;
  created_by: User;
  url: string;
  ssl_logs: SslLog[];
  retry_delay: number;
  uptime_logs: UptimeLog[];
}

// Maintenance windows
export interface MaintenanceWindow {
  start_time?: string;
  end_time?: string;
  reason?: string;
  id?: number;
  uuid?: string;
  created_by?: number | null;
}

// User info
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

// SSL log
export interface SslLog {
  id: number;
  domain: string;
  subject: string;
  issuer: string;
  public_key_algo: string;
  public_key_length: number;
  serial_number: string;
  signature_algorithm: string;
  issued_date: string;
  expiry_date: string;
  last_checked: string;
  days_remaining: number;
  chain_valid: boolean;
  fingerprint: string;
  san_list: string;
}

// Uptime log
export interface UptimeLog {
  id: number;
  checked_at: string;
  http_status: number;
  response_time_ms: number;
  status: 'UP' | 'DOWN' | 'SSL_WARNING';
  error_message: string | null;
  region: string | null;
}
