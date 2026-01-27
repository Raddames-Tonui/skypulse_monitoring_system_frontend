import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import type {ApiError, ApiResponse,} from "@/utils/types.ts";
import type {
    IncidentsPaginatedResponse,
    MaintenanceWindowsPaginatedResponse, MonitoredServicesPaginatedResponse,
    ServiceOverviewData, UptimeLogsPaginatedResponse
} from "@/pages/services/data-access/types.ts";


export interface QueryParams {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    filter?: Record<string, string | number | boolean>;
}

export interface MonitoredService {
    uuid: string;
    monitored_service_name: string;
    monitored_service_url: string;
    ssl_enabled: boolean;
    is_active: boolean;
    check_interval: number;
    last_uptime_status: string;
    date_created: string;
    [key: string]: any;
}

export interface MonitoredServicesPaginatedResponse {
    data: MonitoredService[];
    total_count: number;
}

const buildQueryString = (params?: QueryParams) => {
    if (!params) return "";
    const query = new URLSearchParams();

    if (params.page) query.append("page", params.page.toString());
    if (params.pageSize) query.append("pageSize", params.pageSize.toString());

    if (params.sortBy) {
        const direction = params.sortOrder ?? "asc";
        query.append("sort", `${params.sortBy}:${direction}`);
    }

    if (params.filter) {
        Object.entries(params.filter).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                query.append(key, value.toString());
            }
        });
    }

    const queryString = query.toString();
    return queryString ? `?${queryString}` : "";
};

export const useGetMonitoredServices = (params?: QueryParams) =>
    useQuery<MonitoredServicesPaginatedResponse, Error>({
        queryKey: ["monitored-services", params],
        queryFn: async () => {
            const queryString = buildQueryString(params);
            const response = await axiosClient.get<MonitoredServicesPaginatedResponse>(
                `/services${queryString}`
            );
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
    });


//  SERVICE OVERVIEW
export const useGetServiceOverview = (uuid: string) =>
    useQuery<ApiResponse<ServiceOverviewData>, ApiError>({
        queryKey: ["service-overview", uuid],
        queryFn: async () => {
            if (!uuid) throw new Error("Missing UUID for service overview");

            const response = await axiosClient.get<ApiResponse<ServiceOverviewData>>(
                `/services/service/overview/${uuid}`
            );
            return response.data;
        },
        enabled: Boolean(uuid),
        staleTime: 5 * 60 * 1000,
    });

//  INCIDENTS
export const useGetIncidents = (uuid: string, params?: QueryParams) =>
    useQuery<IncidentsPaginatedResponse, ApiError>({
        queryKey: ["service-incidents", uuid, params],
        queryFn: async () => {
            const queryString = buildQueryString(params);
            const response = await axiosClient.get<IncidentsPaginatedResponse>(
                `/services/service/${uuid}/incidents${queryString}`
            );
            return response.data;
        },
        enabled: Boolean(uuid),
        staleTime: 5 * 60 * 1000,
    });

//  MAINTENANCE WINDOWS
export const useGetMaintenanceWindows = (uuid: string, params?: QueryParams) =>
    useQuery<MaintenanceWindowsPaginatedResponse, ApiError>({
        queryKey: ["service-maintenance-windows", uuid, params],
        queryFn: async () => {
            const queryString = buildQueryString(params);
            const response = await axiosClient.get<MaintenanceWindowsPaginatedResponse>(
                `/services/service/${uuid}/maintenance-windows${queryString}`
            );
            return response.data;
        },
        enabled: Boolean(uuid),
        staleTime: 5 * 60 * 1000,
    });



// UPTIME LOGS
export const useGetUptimeLogs = (uuid: string, params?: QueryParams) =>
    useQuery<UptimeLogsPaginatedResponse, ApiError>({
        queryKey: ["service-uptime-logs", uuid, params],
        queryFn: async () => {
            const queryString = buildQueryString(params);
            const response = await axiosClient.get<UptimeLogsPaginatedResponse>(
                `/services/service/${uuid}/uptime-logs${queryString}`
            );
            return response.data;
        },
        enabled: Boolean(uuid),
        staleTime: 5 * 60 * 1000,
    });
