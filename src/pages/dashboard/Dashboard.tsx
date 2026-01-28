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

                const color =
                    val === "DOWN"
                        ? "#e74c3c"
                        : val === "MAINTENANCE"
                            ? "#f1c40f"
                            : val === "PAUSED"
                                ? "#95a5a6"
                                : "#27ae60"; // default UP

                return (
                    <span
                        style={{
                            display: "inline-block",
                            padding: "2px 10px",
                            borderRadius: 5,
                            backgroundColor: color,
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
            renderCell: (_, row) => {
                const days = row.ssl_days_remaining;
                let status = String(row.ssl_status ?? "UNKNOWN").toUpperCase();

                // Map days_remaining to status
                if (days === -1) status = "FAILED";
                else if (days != null) {
                    if (days <= 7) status = "SEVERE";
                    else if (days <= 14) status = "CRITICAL";
                    else if (days <= 30) status = "WARNING";
                    else status = "OK";
                }

                const color =
                    status === "FAILED" ? "#e74c3c" :
                        status === "SEVERE" ? "#e74c3c" :
                            status === "CRITICAL" ? "#e67e22" :
                                status === "WARNING" ? "#f1c40f" :
                                    status === "OK" ? "#27ae60" :
                                        "#95a5a6"; // UNKNOWN

                return (
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Icon
                            iconName={status === "OK" ? "sslValid" : "sslInvalid"}
                            style={{ color, fontWeight: 600, fontSize: "1.8rem" }}
                        />
                        <strong style={{ color, marginLeft: 5 }}>{status}</strong>
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
                const days = row.ssl_days_remaining;
                let status = String(row.ssl_status ?? "UNKNOWN").toUpperCase();

                if (days === -1) status = "FAILED";
                else if (days != null) {
                    if (days <= 7) status = "SEVERE";
                    else if (days <= 14) status = "CRITICAL";
                    else if (days <= 30) status = "WARNING";
                    else status = "OK";
                } else status = "UNKNOWN";

                const color =
                    status === "FAILED" ? "#e74c3c" :
                        status === "SEVERE" ? "#e74c3c" :
                            status === "CRITICAL" ? "#e67e22" :
                                status === "WARNING" ? "#f1c40f" :
                                    status === "OK" ? "#323232" :
                                        "#95a5a6";

                return (
                    <span style={{ fontWeight: 500, color }}>
                        {days != null && days >= 0 ? `${days} days` : "-"}
                    </span>
                );
            },
        },
        {
            id: "actions",
            caption: "Actions",
            size: 100,
            renderCell: (_, row) => (
                <Link to="/services/$uuid" params={{ uuid: row.uuid }} className="action-btn">
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
