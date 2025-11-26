import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSSE } from "@/utils/constants/useSSE";
import { DataTable,  } from "@/components/table/DataTable";
import type { ColumnProps } from "@/components/table/DataTable";
import StatusSidebar from "./StatusSidebar";

interface Service {
  uuid: string;
  name: string;
  status: string;
  response_time_ms: number;
  ssl_warning: boolean;
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
      renderCell: (val) => (val ? "Warn" : "✔️ OK"),
    },
  ];

  // Make row clickable
  const rowRender = (row: Service, defaultCells: React.ReactNode) => {
    return (
      <tr
        // onClick={() => navigate(`/services/${row.uuid}`)}
        style={{ cursor: "pointer" }}
      >
        {defaultCells}
      </tr>
    );
  };

  return (
    <div>
      <h2>Service Monitoring Dashboard</h2>

      <DataTable<Service>
        columns={columns}
        data={sseData?.services || []}
        rowRender={rowRender}
        isLoading={!sseData}
      />
     <StatusSidebar data={sseData} />
</div>
  );
}
