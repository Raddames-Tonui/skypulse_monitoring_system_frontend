import React from "react";
import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import type { MonitoredService } from "@/utils/types";
import { Route as SingleServiceRoute } from "@/routes/_protected/services/$uuid";

export default function SingleServicePage() {
  // Get the dynamic route param (uuid)
  const { uuid } = useParams({ from: SingleServiceRoute.id });

const { data, isLoading, isError, error } = useQuery<MonitoredService, Error>({
  queryKey: ["monitoredService", uuid],
  queryFn: async () => {
    if (!uuid) throw new Error("Missing UUID");

    const params = new URLSearchParams({ uuid }).toString();
    const response = await axiosClient.get(`/services/service?${params}`);

    // Backend returns { records: [ ... ] }
    const record = response.data.records?.[0];
    if (!record) throw new Error("Service not found");

    return record as MonitoredService;
  },
  enabled: !!uuid,
});


  // Handle missing or invalid UUID
  if (!uuid) return <div className="text-red-500">UUID missing in route</div>;

  // Handle loading / error states
  if (isLoading) return <div>Loading service...</div>;
  if (isError) return <div className="text-red-500">Error: {error?.message}</div>;
  if (!data) return <div className="text-red-500">No service found</div>;

  // Now 'data' is the 'MonitoredService' object directly
  const service = data;

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        {service.monitored_service_name}
      </h2>

      <div className="space-y-2 text-gray-700">
        <p><strong>URL:</strong> {service.monitored_service_url}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`ml-2 px-2 py-1 text-sm rounded-md ${
              service.last_uptime_status === "UP"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {service.last_uptime_status}
          </span>
        </p>
        <p><strong>Expected Status Code:</strong> {service.expected_status_code}</p>
        <p><strong>Check Interval:</strong> {service.check_interval} sec</p>
        <p><strong>Retry Count:</strong> {service.retry_count}</p>
        <p><strong>Retry Delay:</strong> {service.retry_delay} sec</p>
        <p><strong>SSL Enabled:</strong> {service.ssl_enabled ? "Yes" : "No"}</p>
        <p><strong>Region:</strong> {service.monitored_service_region}</p>
        <p><strong>Consecutive Failures:</strong> {service.consecutive_failures}</p>
        <p>
          <strong>Last Checked:</strong>{" "}
          {service.last_checked
            ? new Date(service.last_checked).toLocaleString()
            : "Never"}
        </p>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p><strong>Date Created:</strong> {new Date(service.date_created).toLocaleString()}</p>
        <p><strong>Date Modified:</strong> {new Date(service.date_modified).toLocaleString()}</p>
        <p><strong>UUID:</strong> {service.uuid}</p>
      </div>
    </div>
  );
}
