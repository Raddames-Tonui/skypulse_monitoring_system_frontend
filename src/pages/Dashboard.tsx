import { useNavigate } from "@tanstack/react-router";
import { DataTable } from "@/components/table/DataTable";
import type { ColumnProps } from "@/components/table/DataTable";
import StatusSidebar from "../components/StatusSidebar";
import "@/css/dashboard.css";
import { useServiceStatusSSE } from "@/hooks/useSSE";
import type { Service } from "@/utils/types";

export default function Dashboard() {
  const navigate = useNavigate();

  const sseData = useServiceStatusSSE();

  const columns: ColumnProps<Service>[] = [
    { id: "name", caption: "Service Name", size: 200 },
    { id: "status", caption: "Status", size: 100 },
    { id: "response_time_ms", caption: "Response Time (ms)", size: 150 },
    {
      id: "ssl_status",
      caption: "SSL Status",
      size: 120,
      renderCell: (val: string, row) => {
        let color = "green";
        if (val === "WARNING") color = "orange";
        if (val === "CRITICAL") color = "red";
        if (val === "SEVERE") color = "darkred";
        return (
          <span style={{ color }}>
            {val} ({row.ssl_days_remaining ?? "N/A"}d)
          </span>
        );
      },
    },
    {
      id: "actions",
      caption: "Actions",
      size: 200,
      renderCell: (_, row) => (
        <button
          className="view-button"
          onClick={() =>
            navigate({
              to: "/services/$uuid",
              params: { uuid: row.uuid },
            })
          }
        >
          View
        </button>
      ),
    },
  ];


  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="dashboard-wrapper">
        <div className="status-sidebar-wrapper">
          <StatusSidebar data={sseData} />
        </div>


        <div className="data-table-wrapper">
          <DataTable<Service>
            columns={columns}
            data={sseData?.services || []}
            isLoading={!sseData}
            enableSort={false}
            enableFilter={false}
            enableRefresh={false}
          />
        </div>
      </div>
    </div>
  );
}