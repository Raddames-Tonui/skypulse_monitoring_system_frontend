
export interface MonitoredService {
  uuid: string;
  name: string;
  url: string;
  region: string;
  check_interval: number;
  retry_count: number;
  retry_delay: number;
  expected_status_code: number;
  ssl_enabled: boolean;
  last_uptime_status: string;
  consecutive_failures: number;
  last_checked?: string;
  date_created: string;
  date_modified: string;
  is_active: boolean;

  created_by: User;
  contact_groups: ContactGroup[];
  uptime_logs: UptimeLog[];
  ssl_logs: SslLog[];
  incidents: Incident[];
  maintenance_windows: MaintenanceWindow[];
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface ContactGroup {
  id: number;
  uuid: string;
  name: string;
  description?: string | null;
}

export interface UptimeLog {
  id: number;
  checked_at?: string;
  http_status?: number;
  status: string;
  response_time_ms?: number;
  region?: string | null;
  error_message?: string | null;
}

export interface SslLog {
  id: number;
  domain: string;
  subject?: string | null;
  issuer?: string | null;
  issued_date?: string | null;
  expiry_date?: string | null;
  days_remaining?: number | null;
  public_key_algo?: string | null;
  public_key_length?: number | null;
  serial_number?: string | null;
  fingerprint?: string | null;
  signature_algorithm?: string | null;
  san_list?: string | null;
  chain_valid?: boolean | null;
  last_checked?: string | null;
}

export interface Incident {
  id: number;
  uuid: string;
  started_at?: string | null;
  resolved_at?: string | null;
  duration_minutes?: number | null;
  cause?: string | null;
  status?: string | null;
}

export interface MaintenanceWindow {
  id: number;
  uuid: string;
  start_time: string;
  end_time: string;
  reason?: string | null;
  created_by?: number | null;
}
