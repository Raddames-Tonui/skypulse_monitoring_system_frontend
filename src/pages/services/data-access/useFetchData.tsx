// ----------- MONITORED SERVICE TYPE -----------
import {useQuery} from "@tanstack/react-query";
import type {ApiError, ApiResponse} from "@/utils/types.ts";
import axiosClient from "@/utils/constants/axiosClient.tsx";

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

export const useMonitoredServices = (
    params: Record<string, string | number | boolean>
) => {
    return useQuery<ApiResponse<MonitoredService[]>, ApiError>({
        queryKey: ["monitoredServices", params],
        queryFn: async () => {
            const {data} = await axiosClient.get<ApiResponse<MonitoredService[]>>(
                "/services",
                {params}
            );
            return data;
        },
    });
};