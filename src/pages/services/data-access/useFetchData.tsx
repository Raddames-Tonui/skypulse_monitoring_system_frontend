import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import type {ApiError, ApiResponse,} from "@/utils/types.ts";
import type {
    IncidentsPaginatedResponse,
    MaintenanceWindowsPaginatedResponse, MonitoredServicesPaginatedResponse,
    ServiceOverviewData, UptimeLogsPaginatedResponse
} from "@/pages/services/data-access/types.ts";

type QueryParams = {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    filter?: Record<string, string | number | boolean>;
};

const buildQueryString = (params?: QueryParams) => {
    if (!params) return "";
    const query = new URLSearchParams();

    if (params.page) query.append("page", params.page.toString());
    if (params.pageSize) query.append("page_size", params.pageSize.toString());
    if (params.sortBy) query.append("sort_by", params.sortBy);
    if (params.sortOrder) query.append("sort_order", params.sortOrder);

    if (params.filter) {
        Object.entries(params.filter).forEach(([key, value]) => {
            query.append(`filter[${key}]`, value.toString());
        });
    }

    const queryString = query.toString();
    return queryString ? `?${queryString}` : "";
};

//  SERVICE OVERVIEW
export const useGetServiceOverview = (uuid: string) =>
    useQuery<ApiResponse<ServiceOverviewData>, ApiError>({
        queryKey: ["service-overview", uuid],
        queryFn: async () => {
            if (!uuid) throw new Error("Missing UUID for service overview");

            const response = await axiosClient.get<ApiResponse<ServiceOverviewData>>(
                `/services/service/${uuid}/overview`
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

//  MONITORED SERVICES
export const useGetMonitoredServices = (params?: QueryParams) =>
    useQuery<MonitoredServicesPaginatedResponse, ApiError>({
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
