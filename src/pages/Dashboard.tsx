import { Link } from "@tanstack/react-router";
import { DataTable } from "@/components/table/DataTable";
import type { ColumnProps } from "@/components/table/DataTable";
import StatusSidebar from "../components/StatusSidebar";
import { useSystemHealthSSE, useServiceStatusSSE } from "@/hooks/useSSE";
import type { Service } from "@/utils/types";
import "@/css/dashboard.css";


export default function Dashboard() {
  const sseData = useServiceStatusSSE();
  const systemHealth = useSystemHealthSSE();


  const columns: ColumnProps<Service>[] = [
    { id: "name", caption: "Service Name", size: 200 },
    {
      id: "status", caption: "Status", size: 100, renderCell: (value) => {
        const val = String(value ?? "");

        let color = "green";
        if (val === "DOWN") color = "red";
        if (val === "MAINTENANCE") color = "gold"
        return <span style={{ color }}>{val}</span>

      }
    },
    { id: "response_time_ms", caption: "Response Time (ms)", size: 150 },
    {
      id: "ssl_status",
      caption: "SSL Status",
      size: 120,
      renderCell: (value, row) => {
        const val = String(value ?? "");

        let color = "green";
        if (val === "WARNING") color = "orange";
        if (val === "CRITICAL") color = "red";
        if (val === "SEVERE") color = "darkred";

        return (
          <span style={{ color }}>
            {val} ({row.ssl_days_remaining ?? "N/A"}d)
          </span>
        );
      }
    },
    {
      id: "actions",
      caption: "Actions",
      size: 200,
      renderCell: (_, row) => (
        <Link to="/services/$uuid"
          params={{ uuid: row.uuid }}
          className="action-btn"
        >
          View
        </Link>
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
          <StatusSidebar data={sseData} system={systemHealth} />
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