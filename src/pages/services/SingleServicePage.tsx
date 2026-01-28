import { createFileRoute } from "@tanstack/react-router";
import {
  useGetServiceOverview,
  useGetUptimeLogs,
  useGetIncidents,
  useGetMaintenanceWindows,
} from "@/pages/services/data-access/useFetchData.tsx";
import ServiceHeader from "./components/ServiceHeader";
import ServiceOverview from "./components/ServiceOverview";
import ServiceCharts from "./components/ServiceCharts";
import ServiceTableSection from "./components/ServiceTableSection";
import Loader from "@components/layout/Loader.tsx";
import "@/css/singleService.css";


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

  const {
    data: overviewResp,
    isPending,
    isError: overviewError,
    error: overviewErr,
  } = useGetServiceOverview(uuid);

  const { data: uptimeData, isPending: pendingUptime } = useGetUptimeLogs(uuid);
  const { data: incidentsData, isPending: pendingIncidents } = useGetIncidents(uuid);
  const { data: maintenanceData, isPending: pendingMaintenance } = useGetMaintenanceWindows(uuid);

  const overview = overviewResp?.data;

  const setActiveTab = (newTab: ServiceTab) => navigate({ search: (prev) => ({ ...prev, tab: newTab }) });

  if (isPending) {
    return <Loader/>;
  }

  if (overviewError) {
    return <div className="error">Error: {overviewErr?.message || "Failed to load service"}</div>;
  }

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

  const uptimeColumns = [
    { id: "uptime_log_id", caption: "ID", size: 100 },
    { id: "checked_at", caption: "Checked At", size: 200 },
    { id: "status", caption: "Status", size: 120 },
    { id: "response_time_ms", caption: "Response Time (ms)", size: 150 },
    { id: "error_message", caption: "Error", size: 250 },
  ];

  const incidentColumns = [
    { id: "incident_id", caption: "ID", size: 100 },
    { id: "status", caption: "Status", size: 100 },
    { id: "cause", caption: "Cause", size: 200 },
    { id: "started_at", caption: "Started At", size: 200 },
    { id: "resolved_at", caption: "Resolved At", size: 200 },
    { id: "duration_minutes", caption: "Duration (min)", size: 150 },
  ];

  const maintenanceColumns = [
    { id: "maintenance_window_id", caption: "ID", size: 100 },
    { id: "start_time", caption: "Start Time", size: 200 },
    { id: "end_time", caption: "End Time", size: 200 },
    { id: "reason", caption: "Reason", size: 300 },
    { id: "created_by", caption: "Created By", size: 150 },
  ];


  return (
      <>
        <ServiceHeader
            name={overview?.name || "Service"}
            tab={tab}
            setActiveTab={setActiveTab}
            tabs={["overview", "charts", "uptime", "incidents", "maintenance"]}
        />

        {tab === "overview" && <ServiceOverview overview={overview} />}
        {tab === "charts" && <ServiceCharts uptimePieData={uptimePieData} responseChartData={responseChartData} />}
        {tab === "uptime" && (
            <ServiceTableSection
                title="Uptime Logs"
                columns={uptimeColumns}
                data={uptimeLogs}
                isLoading={pendingUptime}
            />
        )}
        {tab === "incidents" && (
            <ServiceTableSection
                title="Incidents"
                columns={incidentColumns}
                data={incidentsData?.data || []}
                isLoading={pendingIncidents}
            />
        )}
        {tab === "maintenance" && (
            <ServiceTableSection
                title="Maintenance Windows"
                columns={maintenanceColumns}
                data={maintenanceData?.data || []}
                isLoading={pendingMaintenance}
            />
        )}
      </>
  );
}
