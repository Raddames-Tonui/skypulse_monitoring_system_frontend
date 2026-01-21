
// ----------- DASHBOARD SSL  --------------------------

export interface Service {
    uuid: string;
    name: string;
    status: string;
    response_time_ms: number | null;
    ssl_days_remaining: number | null;
    ssl_status: "OK" | "WARNING" | "CRITICAL" | "SEVERE";
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