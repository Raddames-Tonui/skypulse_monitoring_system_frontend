import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import type { MonitoredService } from "@/utils/types";
import { Route as SingleServiceRoute } from "@/routes/_protected/services/$uuid";

import SimpleAreaChart from "@/components/charts/SimpleAreaChart";
import PieChartWithCustomizedLabel from "@/components/charts/PieChartWithCustomizedLabel";

import { DataTable } from "@/components/table/DataTable";
import type { ColumnProps } from "@/components/table/DataTable";
import "@/css/singleService.css";
import Loader from "@/components/Loader";

export default function SingleServicePage() {
  const { uuid } = useParams({ from: SingleServiceRoute.id });

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


  const uptimeTableRows = service.uptime_logs.map((log) => ({
    uuid: service.uuid,
    name: `Check #${log.id}`,
    status: log.status,
    response_time_ms: log.response_time_ms,
    ssl_warning: service.ssl_logs?.[0]?.days_remaining < 30,
  }));

  const columns: ColumnProps<any>[] = [
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

  // Uptime Pie Chart Values
  const uptimeCount = {
    up: 0,
    down: 0,
    maintenance: 0,
  };

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

  // Response Time Chart
  const responseChartData = service.uptime_logs.map((log) => ({
    name: new Date(log.checked_at).toLocaleTimeString(),
    uv: log.response_time_ms,
  }));

  // Component UI
  return (
    <div className="service-container">
      <header className="service-header">
        <h2>{service.name}</h2>

        <span
          className={
            service.last_uptime_status === "UP"
              ? "status-badge status-up"
              : "status-badge status-down"
          }
        >
          {service.last_uptime_status}
        </span>
      </header>

      <div className="page-header">
        <h2>{service.name}</h2>
      </div>

      <section className="service-section">
        <h3>Service Details</h3>
        <div className="service-grid">
          <div><strong>URL:</strong> {service.url}</div>
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
        <h3>Uptime Logs</h3>

        <DataTable
          columns={columns}
          data={uptimeTableRows}
          isLoading={false}
          enableFilter={false}
          enableSort={false}
          enableRefresh={false}
        />
      </section>
    </div>
  );
}
