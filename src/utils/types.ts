import type { IconName } from "./IconsList";

// ----------- GENERIC API RESPONSE -----------

export type ApiResponse<T> = {
  domain: string;
  current_page: number;
  last_page: number;
  page_size: number;
  total_count: number;
  data: T[];
};

export type ApiError = {
  message: string;
  code?: string;
  details?: any;
};


// ---- users -------
export type Users = {
  uuid: string;
  user_id: number;
  first_name: string;
  last_name: string;
  user_email: string;
  role_id: number;
  role_name: string;
  company_id: number;
  company_name: string;
  is_active: boolean;
  date_created: string;
  date_modified: string;
};


// ----------- MONITORED SERVICE TYPE -----------
export interface MonitoredService {
  monitored_service_name: string;
  monitored_service_url: string;
  monitored_service_id: number;
  uuid: string;
  is_active: boolean;
  ssl_enabled: boolean;

  check_interval?: number | null;
  expected_status_code?: number | null;
  monitored_service_region?: string | null;

  retry_delay?: number | null;
  retry_count?: number | null;

  last_uptime_status?: string | null;
  last_checked?: string | null;
  consecutive_failures?: number | null;

  date_created?: string;
  date_modified?: string;

  created_by?: number;
}




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


// ----------CREATE USER -----------
export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  user_email: string;
  role_name: string;
  company_id: number;
}

export interface CreateUserSuccessResponse {
  data: {
    userCreationStatus: "QUEUED";
    userId: number;
    uuid: string;
    emailStatus: "QUEUED";
    tokenGenerationStatus: "QUEUED";
  };
  message: string;
  status: "success";
}


export interface CreateUserErrorResponse {
  message: string;
  status: "error";
}


export type CreateUserResponse =
  | CreateUserSuccessResponse
  | CreateUserErrorResponse;



// -------- SINGLE SERVICE --------------
export interface ServiceDataResponse {
  data: ServiceData;
  message: string;
}

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

export interface MaintenanceWindow {
  start_time?: string;
  end_time?: string;
  reason?: string;
  id?: number;
  uuid?: string;
  created_by?: number | null;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

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

export interface UptimeLog {
  id: number;
  checked_at: string;
  http_status: number;
  response_time_ms: number;
  status: 'UP' | 'DOWN' | 'SSL_WARNING';
  error_message: string | null;
  region: string | null;
}





// ----------- DASHBOARD SSL  --------------------------

export interface Service {
  uuid: string;
  name: string;
  status: string;
  response_time_ms: number | null;
  ssl_days_remaining: number | null;   // actual days remaining
  ssl_status: "OK" | "WARNING" | "CRITICAL" | "SEVERE"; // severity level
  actions?: () => void;
}

export interface SSEPayload {
  timestamp: string;
  total_services: number;
  up_count: number;
  down_count: number;
  ssl_warnings: number;   // <=30 days
  ssl_critical: number;   // <=14 days
  ssl_severe: number;     // <=7 days
  services: Service[];
  sse_push_interval_seconds: number;
}


export interface SystemHealth {
  app: string;
  version: string;
  environment: string;
  uptime_seconds: number;
  timestamp: string;
  database: string;
  database_status: string;
  sse_push_interval_seconds: number;
}



// --------------AUDIT LOGS -----------------------
export interface AuditLogEntry {
  audit_log_id: number;
  user_id: number | null;
  user_full_name: string | null;
  user_email: string | null;

  entity: string;
  entity_id: number | null;
  action: string;

  before_data: Record<string, any> | null;
  after_data: Record<string, any> | null;

  ip_address: string | null;
  date_created: string; 
}

// -----------SIDEBAR PROPS ----------------------
export interface MenuItem {
  icon: IconName;
  label: string;
  path: string;
}

export const menuConfig: Record<string, MenuItem[]> = {
  admin: [
    { icon: "pie", label: "Dashboard", path: "/dashboard" },
    { icon: "user", label: "Users", path: "/users" },
    { icon: "users", label: "Groups", path: "/groups" },
    { icon: "services", label: "Services", path: "/services" },
    { icon: "notepad", label: "Reports", path: "/reports/uptime-reports" },
    { icon: "notes", label: "Audit Logs", path: "/audit-logs" },
    { icon: "settings", label: "Settings", path: "/settings" },
  ],
  operator: [
    { icon: "pie", label: "Operator Dashboard", path: "/dashboard" },
    { icon: "notes", label: "Services", path: "/services" },
    { icon: "notepad", label: "Reports", path: "/reports/uptime-reports" },
  ],
  viewer: [
    { icon: "pie", label: "Viewer Dashboard", path: "/dashboard" },
    { icon: "notes", label: "Services", path: "/services" },
    { icon: "notepad", label: "Reports", path: "/reports/uptime-reports" },
  ],
};