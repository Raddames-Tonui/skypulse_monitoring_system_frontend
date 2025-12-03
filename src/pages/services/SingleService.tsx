import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import type { MonitoredService } from "@/utils/types-single-service";
import { Route as SingleServiceRoute } from "@/routes/_protected/services/$uuid";

import SimpleAreaChart from "@/components/charts/SimpleAreaChart";
import PieChartWithCustomizedLabel from "@/components/charts/PieChartWithCustomizedLabel";

import { DataTable } from "@/components/table/DataTable";
import type { ColumnProps } from "@/components/table/DataTable";
import "@/css/singleService.css";
import Loader from "@/components/Loader";
import UpdateServiceModal from "./UpdateServiceModalProps";
import { useState } from "react";

export default function SingleServicePage() {
  const { uuid } = useParams({ from: SingleServiceRoute.id });
  const [modalOpen, setModalOpen] = useState(false);


  const { data, isLoading, isError, error } = useQuery<MonitoredService, Error>({
    queryKey: ["monitoredService", uuid],
    queryFn: async () => {
      if (!uuid) throw new Error("Missing UUID");

      const response = await axiosClient.get(`/services/service?uuid=${uuid}`);
      const record = response.data?.data;
      if (!record) throw new Error("Service not found");

      return record as MonitoredService;
    },
    enabled: !!uuid,
  });

  if (isLoading) return <div className="loading"><Loader /></div>;
  if (isError) return <div className="error">Error: {error?.message}</div>;
  if (!data) return <div className="error">No service found</div>;

  const service = data;

  // --- Uptime Table ---
  const uptimeTableRows = service.uptime_logs.map((log) => ({
    uuid: service.uuid,
    name: `Check ${log.id}`,
    status: log.status,
    response_time_ms: log.response_time_ms,
    ssl_warning: service.ssl_logs?.[0]?.days_remaining !== undefined && service?.ssl_logs[0].days_remaining < 30,
  }));

  const uptimeColumns: ColumnProps<typeof uptimeTableRows[number]>[] = [
    { id: "name", caption: "Service Name", size: 200 },
    { id: "status", caption: "Status", size: 100 },
    { id: "response_time_ms", caption: "Response Time (ms)", size: 150 },
    {
      id: "ssl_warning",
      caption: "SSL",
      size: 80,
      renderCell: (val) => (val ? "Warn" : "OK"),
    },
  ];

  // --- Contact Groups Table ---
  const contactGroupColumns: ColumnProps<typeof service.contact_groups[number]>[] = [
    { id: "name", caption: "Group Name", size: 200 },
    { id: "description", caption: "Description", size: 300 },
    { id: "uuid", caption: "UUID", size: 300 },
  ];

  // --- Incidents Table ---
  const incidentColumns: ColumnProps<typeof service.incidents[number]>[] = [
    { id: "uuid", caption: "Incident UUID", size: 250 },
    { id: "status", caption: "Status", size: 100 },
    { id: "cause", caption: "Cause", size: 200 },
    { id: "started_at", caption: "Started At", size: 200 },
    { id: "resolved_at", caption: "Resolved At", size: 200 },
    { id: "duration_minutes", caption: "Duration (min)", size: 150 },
  ];

  // --- Maintenance Windows Table ---
  const maintenanceColumns: ColumnProps<typeof service.maintenance_windows[number]>[] = [
    { id: "uuid", caption: "UUID", size: 250 },
    { id: "start_time", caption: "Start Time", size: 200 },
    { id: "end_time", caption: "End Time", size: 200 },
    { id: "reason", caption: "Reason", size: 300 },
    { id: "created_by", caption: "Created By", size: 150 },
  ];

  // --- Uptime Pie Chart ---
  const uptimeCount = { up: 0, down: 0, maintenance: 0 };
  service.uptime_logs.forEach((log) => {
    if (log.status === "UP") uptimeCount.up++;
    else if (log.status === "DOWN") uptimeCount.down++;
    else uptimeCount.maintenance++;
  });

  const uptimePieData = [
    { name: "Up", value: uptimeCount.up },
    { name: "Down", value: uptimeCount.down },
    { name: "Maintenance", value: uptimeCount.maintenance },
  ];

  // --- Response Time Chart ---
  const responseChartData = service.uptime_logs.map((log) => ({
    name: log.checked_at ? new Date(log.checked_at).toLocaleTimeString() : "N/A",
    uv: log.response_time_ms ?? 0,
  }));


  return (
    <>
      <div className="page-header">
        <h1>{service.name}</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <span
            className={
              service.last_uptime_status === "UP"
                ? "status-badge status-up"
                : "status-badge status-down"
            }
          >
            {service.last_uptime_status}
          </span>
          <button
            className="view-button"
            onClick={() => setModalOpen(true)}
          >
            Edit
          </button>
        </div>
      </div>

      <UpdateServiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={service} 
      />


      <section className="service-section">
        <h3>Service Details</h3>
        <div className="service-grid" style={{ margin: "10px 0" }}>
          <strong> Service URL:</strong>{" "}
          <a href={service.url} target="_blank" rel="noopener noreferrer">
            {service.url}
          </a>
        </div>
        <div className="service-grid">
          <div><strong>Expected Status:</strong> {service.expected_status_code}</div>
          <div><strong>Check Interval:</strong> {service.check_interval}s</div>
          <div><strong>Retry Count:</strong> {service.retry_count}</div>
          <div><strong>Retry Delay:</strong> {service.retry_delay}s</div>
          <div><strong>Region:</strong> {service.region}</div>
          <div><strong>SSL Enabled:</strong> {service.ssl_enabled ? "Yes" : "No"}</div>
          <div><strong>Consecutive Failures:</strong> {service.consecutive_failures}</div>
        </div>
      </section>


      <section className="service-section">
        <h3>Charts</h3>
        <div className="charts-container">
          <div className="chart-card">
            <h4>Uptime History</h4>
            <PieChartWithCustomizedLabel data={uptimePieData} />
          </div>

          <div className="chart-card">
            <h4>Response Time Over Time</h4>
            <SimpleAreaChart data={responseChartData} />
          </div>
        </div>
      </section>


      <section className="service-section">
        <h3>Contact Groups</h3>
        <DataTable
          columns={contactGroupColumns}
          data={service.contact_groups}
          isLoading={false}
          enableFilter={false}
          enableSort={false}
          enableRefresh={false}
        />
      </section>

      <section className="service-section">
        <h3>Incidents</h3>
        <DataTable
          columns={incidentColumns}
          data={service.incidents}
          isLoading={false}
          enableFilter={false}
          enableSort={false}
          enableRefresh={false}
        />
      </section>

      <section className="service-section">
        <h3>Maintenance Windows</h3>
        <DataTable
          columns={maintenanceColumns}
          data={service.maintenance_windows}
          isLoading={false}
          enableFilter={false}
          enableSort={false}
          enableRefresh={false}
        />
      </section>

      <section className="service-section">
        <h3>Uptime Logs</h3>
        <DataTable
          columns={uptimeColumns}
          data={uptimeTableRows}
          isLoading={false}
          enableFilter={false}
          enableSort={false}
          enableRefresh={false}
        />

      </section>


    </>
  );
}
