import { Link } from "@tanstack/react-router";
import { DataTable } from "@components/table/DataTable.tsx";
import type { ColumnProps } from "@components/table/DataTable.tsx";
import StatusSidebar from "@/pages/dashboard/StatusSidebar.tsx";
import {
    useSystemHealthSSE,
    useServiceStatusSSE,
} from "@/pages/dashboard/data-access/useSSE.tsx";
import type { Service } from "@/pages/dashboard/data-access/types.ts";
import Icon from "@/utils/Icon.tsx";
import "@css/dashboard.css";

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

                return (
                    <span
                        style={{
                            display: "inline-block",
                            padding: "2px 10px",
                            borderRadius: 5,
                            backgroundColor:
                                val === "DOWN"
                                    ? "#e74c3c"
                                    : val === "MAINTENANCE"
                                        ? "#f1c40f"
                                        : "#27ae60",
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
            size: 160,
            renderCell: (value, row) => {
                const status = String(value ?? "").toUpperCase();
                const days = row.ssl_days_remaining ?? 0;

                const color =
                    status === "CRITICAL" ||
                    status === "SEVERE" ||
                    days <= 14
                        ? "#e74c3c"
                        : status === "WARNING" ||
                        (days > 14 && days <= 18)
                            ? "#f1c40f"
                            : "#27ae60";

                return (
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <Icon
                            iconName={
                                status === "WARNING" ||
                                status === "CRITICAL" ||
                                status === "SEVERE" ||
                                days <= 18
                                    ? "sslinvalid"
                                    : "sslvalid"
                            }
                            style={{
                                color,
                                fontWeight: 600,
                                fontSize: "1.8rem",
                            }}
                        />
                        <strong style={{color}}>{status}</strong>
                    </div>

                );
            },
        },

        {
            id: "ssl_days_remaining",
            caption: "Days Remaining",
            align: "left",
            size: 140,
            renderCell: (_, row) => {
                const days = row.ssl_days_remaining ?? 0;
                const status = String(row.ssl_status ?? "").toUpperCase();

                const color =
                    status === "CRITICAL" ||
                    status === "SEVERE" ||
                    days <= 14
                        ? "#e74c3c"
                        : status === "WARNING" ||
                        (days > 14 && days <= 18)
                            ? "#f1c40f"
                            : "";

                return (
                    <span
                        style={{
                            fontWeight: 600,
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
                    params={{uuid: row.uuid}}
                    className="action-btn"               >
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
