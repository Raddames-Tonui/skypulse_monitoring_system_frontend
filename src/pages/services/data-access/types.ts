// -------------------- API RESPONSES --------------------
export interface ApiResponse<T> {
    data: T;
    message: string;
}

export interface ApiPaginatedResponse<T> {
    data: T;
    last_page: number;
    total_count: number;
    domain: string;
    current_page: number;
    page_size: number;
}

export interface ApiError {
    message: string;
    status?: string;
}



// -------------------- SERVICE OVERVIEW --------------------
export interface CreatedBy {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

export interface ContactGroupOverview {
    id: number;
    uuid: string;
    name: string;
    description: string;
}

export interface ServiceOverviewData {
    uuid: string;
    name: string;
    url: string;
    check_interval: number | null;
    retry_delay: number | null;
    expected_status_code: number | null;
    is_active: boolean;
    ssl_enabled: boolean;
    date_created: string;
    date_modified: string;
    last_checked: string;
    retry_count: number | null;
    consecutive_failures: number;
    created_by: CreatedBy | number | null;
    contact_groups: ContactGroupOverview[];
    last_uptime_status: 'UP' | 'DOWN' | string;
    region: string;
}



// -------------------- INCIDENTS --------------------
export interface Incident {
    monitored_service_id: number;
    incident_id: number;
    duration_minutes: number | null;
    date_modified: string;
    resolved_at: string | null;
    date_created: string;
    monitored_service_name: string;
    started_at: string;
    cause: string | null;
    uuid: string;
    status: 'open' | 'closed' | string;
}

export type IncidentsData = Incident[];
export type IncidentsPaginatedResponse = ApiPaginatedResponse<IncidentsData>;



// -------------------- MAINTENANCE WINDOWS --------------------
export interface MaintenanceWindow {
    maintenance_window_id: number;
    uuid: string;
    monitored_service_id: number;
    window_name: string;
    reason: string | null;
    start_time: string;
    end_time: string;
    date_created: string;
    date_modified: string;
    monitored_service_name: string;
    created_by: CreatedBy | null;
}


export type MaintenanceWindowsData = MaintenanceWindow[];
export type MaintenanceWindowsPaginatedResponse = ApiPaginatedResponse<MaintenanceWindowsData>;

// -------------------- UPTIME LOGS --------------------
export interface UptimeLog {
    uptime_log_id: number;
    monitored_service_id: number;
    monitored_service_name: string;
    checked_at: string;
    date_created: string;
    date_modified: string;
    http_status: number;
    response_time_ms: number;
    status: 'UP' | 'DOWN' | 'MAINTENANCE' | string;
    error_message: string | null;
}

export type UptimeLogsData = UptimeLog[];

export interface UptimeLogsPaginatedResponse extends ApiPaginatedResponse<UptimeLogsData> {
    data: UptimeLogsData;
    domain: "uptime_logs";
}

// -------------------- MONITORED SERVICES --------------------
export interface MonitoredService {
    monitored_service_id: number;
    uuid: string;
    monitored_service_name: string;
    monitored_service_url: string;
    check_interval: number | null;
    retry_delay: number | null;
    expected_status_code: number | null;
    is_active: boolean;
    ssl_enabled: boolean;
    date_created: string;
    date_modified: string;
    last_checked: string;
    retry_count: number | null;
    consecutive_failures: number;
    created_by: number | null;
    monitored_service_region: string;
    last_uptime_status: 'UP' | 'DOWN' | string;
}

export type MonitoredServicesData = MonitoredService[];
export type MonitoredServicesPaginatedResponse = ApiPaginatedResponse<MonitoredServicesData>;
