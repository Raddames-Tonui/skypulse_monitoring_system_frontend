
// ----------- GENERIC API RESPONSE -----------
export type ApiResponse<T> = {
    domain: string;
    current_page: number;
    last_page: number;
    page_size: number;
    total_count: number;
    data: T[];
}

export type ApiError = {
    message: string;
    code?: string;
    details?: any;
};





// Specific User type
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

export interface SortRule {
  column: string;
  direction: 'asc' | 'desc';
}

export interface FilterRule {
  column: string;
  value: any;
}


export interface UserContact {
  contactType?: string;       
  value?: string;
  verified?: boolean;
  isPrimary?: boolean;       
}

export interface UserPreferences {
  alertChannel?: string;     
  receiveWeeklyReports?: boolean;
  language?: string;
  timezone?: string;
  dashboardLayout?: Record<string, any>; 
}

export interface UserProfile {
  uuid: string;
  fullName: string;          
  email: string;
  roleName: string;          
  companyName?: string;      
  userContacts?: UserContact[]; 
  userPreferences?: UserPreferences; 
}

export interface SSLLog {
    ssl_log_id: number;
    service_name: string;
    domain: string | null;
    issuer: string | null;
    issuer_common_name?: string;
    issuer_org?: string;
    issuer_country?: string;
    serial_number: string | null;
    signature_algorithm: string | null;
    public_key_algo: string | null;
    public_key_length: number | null;
    san_list: string | null;
    chain_valid: boolean;
    subject: string | null;
    fingerprint: string | null;
    issued_date: string | null;
    expiry_date: string | null;
    days_remaining: number | null;
    last_checked: string;
}

export interface SSLLogsResponse {
    data: SSLLog[];
    total_count: number;
    current_page: number;
    page_size: number;
    last_page: number;
}

export interface UptimeLog {
    uptime_log_id: number;
    monitored_service_id: number;
    monitored_service_name: string;
    status: string;
    response_time_ms: number | null;
    http_status: number | null;
    error_message: string | null;
    region: string | null;
    is_active: boolean;
    ssl_enabled: boolean;
    checked_at: string;
    date_created: string;
}

export interface UptimeLogsResponse {
    data: UptimeLog[];
    total_count: number;
    current_page: number;
    page_size: number;
    last_page: number;
}




export interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  error: string | null;
}




export type UserRecord = {
    user_email: string;
    is_active: boolean;
    date_created: string; 
    last_name: string;
    uuid: string;
    role_name: 'Admin' | 'Operator' | 'Viewer'; 
    date_modified: string; 
    company_name: string;
    id: number;
    first_name: string;
};

export type UsersApiResponse = ApiResponse<UserRecord>;


// SETTINGS

export interface Service {
  uuid: string;
  name: string;
  status: string;
  response_time_ms: number;
  ssl_warning: boolean;
  actions: () => void;
}

export interface SSEPayload {
  timestamp: string;
  total_services: number;
  up_count: number;
  down_count: number;
  ssl_warnings: number;
  services: Service[];
}