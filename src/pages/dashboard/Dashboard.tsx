import { Link } from "@tanstack/react-router";
import { DataTable } from "@components/table/DataTable.tsx";
import type { ColumnProps } from "@components/table/DataTable.tsx";
import StatusSidebar from "@/pages/dashboard/StatusSidebar.tsx";
import { useSystemHealthSSE, useServiceStatusSSE } from "@/pages/dashboard/data-access/useSSE.tsx";
import "@css/dashboard.css";
import type {Service} from "@/pages/dashboard/data-access/types.ts";

export default function Dashboard() {
  const sseData = useServiceStatusSSE();
  const systemHealth = useSystemHealthSSE();

  const columns: ColumnProps<Service>[] = [
    {
      id: "name",
      caption: "Service Name",
      size: 250,
    },
    {
      id: "status",
      caption: "Uptime Status",
      size: 160,

      renderCell: (value) => {
        const val = String(value ?? "").toUpperCase();
        let bgColor = "#27ae60";

        if (val === "DOWN") bgColor = "#e74c3c";
        else if (val === "MAINTENANCE") bgColor = "#f1c40f";

        return (
          <span
            style={{
              display: "inline-block",
              padding: "2px 10px",
              borderRadius: 5,
              backgroundColor: bgColor,
              color: "#fff",
              fontWeight: 600,
              textAlign: "center",
              minWidth: 90,
            }}
          >
            {val}
          </span>
        );
      },
    },
    {
      id: "response_time_ms",
      caption: "Response Time (ms)",
      size: 150,
    },
    {
      id: "ssl_status",
      caption: "SSL Status",
      align: "left",
      size: 120,
      renderCell: (value, row) => {
        const val = String(value ?? "").toUpperCase();
        let bgColor = "#27ae60";

        if (val === "WARNING" || row.ssl_days_remaining <= 18) bgColor = "#f1c40f";
        if (val === "CRITICAL" || row.ssl_days_remaining <= 14) bgColor = "#e74c3c";
        if (val === "SEVERE") bgColor = "#e74c3c";

        return (
          <span
            style={{
              display: "inline-block",
              padding: "2px 10px",
              borderRadius: 5,
              backgroundColor: bgColor,
              color: "#fff",
              fontWeight: 600,
              textAlign: "center",
              minWidth: 70,
            }}
          >
            {val}
          </span>
        );
      },
    },
    {
      id: "ssl_days_remaining",
      caption: "Days Remaining",
      align: "center",
      size: 120,
      renderCell: (_, row) => {
        const days = row.ssl_days_remaining ?? 0;
        let bgColor = "black";

        if (days <= 7) bgColor = "#e74c3c";
        else if (days <= 14) bgColor = "#f1c40f";

        return (
          <span
            style={{
              display: "inline-block",
              padding: "2px 10px",
              borderRadius: 5,
              color: bgColor,
              textAlign: "center",
              minWidth: 70,
            }}
          >
            {days} days
          </span>
        );
      },
    },

    {
      id: "actions",
      caption: "Actions",
      size: 100,
      renderCell: (_, row) => (
        <Link
          to="/services/$uuid"
          params={{ uuid: row.uuid }}
          className="action-btn"
        >
          View
        </Link >
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
