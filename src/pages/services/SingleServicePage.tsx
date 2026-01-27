import { createFileRoute } from "@tanstack/react-router";
import { useGetServiceOverview, useGetUptimeLogs, useGetIncidents, useGetMaintenanceWindows } from "@/pages/services/data-access/useFetchData.tsx";
import ServiceHeader from "./components/ServiceHeader";
import ServiceOverview from "./components/ServiceOverview";
import ServiceCharts from "./components/ServiceCharts";
import ServiceTableSection from "./components/ServiceTableSection";
import "@/css/singleService.css"


type ServiceTab = "overview" | "uptime" | "incidents" | "maintenance" | "charts";

type ServiceSearch = {
  tab?: ServiceTab;
};

export const Route = createFileRoute("/_protected/services/$uuid")({
  component: SingleServicePage,
  validateSearch: (search: Record<string, unknown>): ServiceSearch => ({
    tab: (search.tab as ServiceSearch["tab"]) || "overview",
  }),
});

export default function SingleServicePage() {
  const { uuid } = Route.useParams();
  const { tab } = Route.useSearch<ServiceSearch>();
  const navigate = Route.useNavigate();

  const { data: overviewResp, isError: overviewError, error: overviewErr } = useGetServiceOverview(uuid);
  const { data: uptimeData, isLoading: loadingUptime } = useGetUptimeLogs(uuid);
  const { data: incidentsData, isLoading: loadingIncidents } = useGetIncidents(uuid);
  const { data: maintenanceData, isLoading: loadingMaintenance } = useGetMaintenanceWindows(uuid);

  const overview = overviewResp?.data;

  if (overviewError) return <div className="error">Error: {overviewErr?.message}</div>;
  if (!overview) return <div className="error">No service found</div>;

  const setActiveTab = (newTab: ServiceTab) => navigate({ search: (prev) => ({ ...prev, tab: newTab }) });

  // --- Charts data ---
  const uptimeLogs = uptimeData?.data || [];
  const uptimeCount = { up: 0, down: 0, maintenance: 0 };
  const responseChartData = uptimeLogs.map((log) => {
    if (log.status === "UP") uptimeCount.up++;
    else if (log.status === "DOWN") uptimeCount.down++;
    else uptimeCount.maintenance++;

    return { name: new Date(log.checked_at).toLocaleTimeString(), uv: log.response_time_ms ?? 0 };
  });
  const uptimePieData = [
    { name: "Up", value: uptimeCount.up },
    { name: "Down", value: uptimeCount.down },
    { name: "Maintenance", value: uptimeCount.maintenance },
  ];

  // --- Columns ---
  const uptimeColumns = [
    { id: "uptime_log_id", caption: "Log ID", size: 100 },
    { id: "checked_at", caption: "Checked At", size: 200 },
    { id: "status", caption: "Status", size: 120 },
    { id: "response_time_ms", caption: "Response Time (ms)", size: 150 },
    { id: "error_message", caption: "Error", size: 250 },
  ];

  const incidentColumns = [
    { id: "uuid", caption: "Incident UUID", size: 250 },
    { id: "status", caption: "Status", size: 100 },
    { id: "cause", caption: "Cause", size: 200 },
    { id: "started_at", caption: "Started At", size: 200 },
    { id: "resolved_at", caption: "Resolved At", size: 200 },
    { id: "duration_minutes", caption: "Duration (min)", size: 150 },
  ];

  const maintenanceColumns = [
    { id: "uuid", caption: "UUID", size: 250 },
    { id: "start_time", caption: "Start Time", size: 200 },
    { id: "end_time", caption: "End Time", size: 200 },
    { id: "reason", caption: "Reason", size: 300 },
    { id: "created_by", caption: "Created By", size: 150 },
  ];

  return (
      <>
        <ServiceHeader
            name={overview.name}
            tab={tab}
            setActiveTab={setActiveTab}
            tabs={["overview", "charts", "uptime", "incidents", "maintenance"]}
        />



        {tab === "overview" && <ServiceOverview overview={overview} />}
        {tab === "charts" && <ServiceCharts uptimePieData={uptimePieData} responseChartData={responseChartData} />}
        {tab === "uptime" && <ServiceTableSection title="Uptime Logs" columns={uptimeColumns} data={uptimeLogs} isLoading={loadingUptime} />}
        {tab === "incidents" && <ServiceTableSection title="Incidents" columns={incidentColumns} data={incidentsData?.data || []} isLoading={loadingIncidents} />}
        {tab === "maintenance" && <ServiceTableSection title="Maintenance Windows" columns={maintenanceColumns} data={maintenanceData?.data || []} isLoading={loadingMaintenance} />}
      </>
  );
}
