import { useNavigate } from "@tanstack/react-router";
import { useSSE } from "@/utils/constants/useSSE";
import { DataTable, } from "@/components/table/DataTable";
import type { ColumnProps } from "@/components/table/DataTable";
import StatusSidebar from "./StatusSidebar";
import "@/css/dashboard.css"

interface Service {
  uuid: string;
  name: string;
  status: string;
  response_time_ms: number;
  ssl_warning: boolean;
  actions: () => void;
}

interface SSEPayload {
  timestamp: string;
  total_services: number;
  up_count: number;
  down_count: number;
  ssl_warnings: number;
  services: Service[];
}

export default function Dashboard() {
  const navigate = useNavigate();

  const sseData = useSSE<SSEPayload>("/sse/service-status");

  const columns: ColumnProps<Service>[] = [
    { id: "name", caption: "Service Name", size: 200 },
    { id: "status", caption: "Status", size: 100 },
    { id: "response_time_ms", caption: "Response Time (ms)", size: 150 },
    {
      id: "ssl_warning",
      caption: "SSL",
      size: 80,
      renderCell: (val) => (val ? "Warn" : "OK"),
    },
    {
      id: "actions",
      caption: "Actions",
      size: 200,
      renderCell: (_, row) => (
        <button
          className="btn btn-primary"
          onClick={() => navigate({
            to: "/services/$uuid",
            params: { uuid: row.uuid }
          })}
        >
          View
        </button>
      ),
    },
  ];


  return (
    <div>
      <h2>Service Monitoring Dashboard</h2>
      <div className="dashboard-wrapper">
        <div className="data-table-wrapper">
          <DataTable<Service>
            columns={columns}
            data={sseData?.services || []}
            isLoading={!sseData}
          />
        </div>

        <div className="status-sidebar-wrapper">
          <StatusSidebar data={sseData} />
        </div>
      </div>
    </div>
  );
}
