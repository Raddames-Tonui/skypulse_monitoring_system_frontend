import { useState, useMemo } from "react";
import { useNavigate, getRouteApi } from "@tanstack/react-router";
import { DataTable } from "@/components/table/DataTable";
import { useAuth } from "@/context/data-access/types";
import type { MonitoredService } from "@/pages/services/data-access/types";
import CreateServiceModal from "@/pages/services/components/CreateService.tsx";
import { type QueryParams, useGetMonitoredServices } from "@/pages/services/data-access/useFetchData.tsx";

const routeApi = getRouteApi("/_protected/services/");

const FILTER_KEY_MAP: Record<string, string> = {
    monitored_service_name: "name",
    is_active: "active",
    ssl_enabled: "ssl",
};

const SORT_KEY_MAP: Record<string, string> = {
    monitored_service_name: "name",
    monitored_service_url: "url",
    check_interval: "interval",
    date_created: "created",
    last_checked: "checked",
    is_active: "active",
    last_uptime_status: "status",
};

export default function MonitoredServicesPage() {
    const navigate = useNavigate({ from: "/services" });
    const { user } = useAuth();
    const search = routeApi.useSearch();
    const { page, pageSize, sort } = search;

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    const filters = useMemo(() => {
        return Object.keys(FILTER_KEY_MAP)
            .map((key) => ({
                column: key,
                value: search[key as keyof typeof search],
            }))
            .filter((f) => f.value !== undefined && f.value !== "") as {
            column: string;
            value: string;
        }[];
    }, [search]);

    const sortBy = useMemo(() => {
        if (!sort) return [];
        return sort.split(",").map((s) => {
            const [column, direction = "asc"] = s.split(":");
            return { column, direction: direction as "asc" | "desc" };
        });
    }, [sort]);

    const queryParams: QueryParams = useMemo(() => {
        const params: QueryParams = { page, pageSize, filter: {} };
        filters.forEach((f) => {
            const backendKey = FILTER_KEY_MAP[f.column] ?? f.column;
            params.filter![backendKey] = f.value;
        });
        if (sortBy.length) {
            params.sortBy = SORT_KEY_MAP[sortBy[0].column] ?? sortBy[0].column;
            params.sortOrder = sortBy[0].direction;
        }
        return params;
    }, [page, pageSize, filters, sortBy]);

    const { data, isLoading, isError, error, refetch } = useGetMonitoredServices(queryParams);
    const services: MonitoredService[] = data?.data ?? [];

    const columns = [
        {
            id: "monitored_service_id",
            caption: "ID",
            size: 50,
            isSortable: false,
            isFilterable: false
        },
        {
            id: "monitored_service_name",
            caption: "Name",
            size: 200,
            isSortable: true,
            isFilterable: true
        },
        {
            id: "monitored_service_url",
            caption: "Service URL",
            size: 250,
            renderCell: (v: string) => (
                <a href={v} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {v}
                </a>
            )
        },
        {
            id: "is_active",
            caption: "Active",
            size: 100,
            align: "center",
            isFilterable: true,
            filterType: "dropdown",
            filterOptions: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            renderCell: (v: boolean) => (v ? "Yes" : "No")
        },
        {
            id: "ssl_enabled",
            caption: "SSL Enabled",
            size: 120,
            align: "center",
            isFilterable: true,
            filterType: "dropdown",
            filterOptions: [
                { label: "Enabled", value: "true" },
                { label: "Disabled", value: "false" }
            ],
            renderCell: (v: boolean) => (v ? "Yes" : "No")
        },
        {
            id: "last_uptime_status",
            caption: "Status",
            size: 120,
            isFilterable: true,
            filterType: "dropdown",
            filterOptions: [
                { label: "UP", value: "up" },
                { label: "DOWN", value: "down" },
                { label: "MAINTENANCE", value: "maintenance" },
            ],
            renderCell: (status: string) => {
                const normalized = (status ?? "").toUpperCase();
                const bgColor = (normalized === "UP") ? "#27ae60" : (normalized === "MAINTENANCE") ? "#f1c40f" : "#e74c3c";
                return (
                    <span style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: 5,
                        backgroundColor: bgColor,
                        color: "#fff",
                        fontWeight: 600,
                        minWidth: 70,
                        textAlign: "center"
                    }}>
                    {normalized}
                </span>
                );
            },
        },
        {
            id: "date_created",
            caption: "Created At",
            size: 160,
            renderCell: (v: string) => new Date(v).toISOString().split("T")[0]
        },
        {
            id: "actions",
            caption: "Actions",
            size: 100,
            renderCell: (_, row) => (
                <button
                    className="action-btn"
                    onClick={() => navigate({ to: "/services/$uuid", params: { uuid: row.uuid } })}
                >
                    View
                </button>
            )
        },
    ];


    return (
        <div className="page-wrapper">
            <div className="page-header flex justify-between items-center mb-4">
                <h1>Monitored Services</h1>
                {user?.role_name !== "VIEWER" && <button className="btn btn-secondary" onClick={() => setCreateModalOpen(true)}>New Service</button>}
            </div>

            <DataTable<MonitoredService>
                columns={columns}
                data={services}
                isLoading={isLoading}
                error={isError ? (error)?.message : undefined}
                onRefresh={refetch}
                initialSort={sortBy}
                initialFilter={filters}
                onSortApply={(rules) => {
                    const sortString = rules.map(r => `${r.column}:${r.direction}`).join(",");
                    navigate({ search: (prev) => ({ ...prev, sort: sortString }) });
                }}
                onFilterApply={(rules) => {
                    navigate({
                        search: (prev) => {
                            const next = { ...prev, page: 1 };
                            delete next.monitored_service_name;
                            delete next.ssl_enabled;
                            delete next.is_active;
                            delete next.last_uptime_status;
                            rules.forEach(r => { if (r.value) next[r.column] = r.value; });
                            return next;
                        },
                    });
                }}
                pagination={{
                    page,
                    pageSize,
                    total: data?.total_count ?? 0,
                    onPageChange: (p) => navigate({ search: (prev) => ({ ...prev, page: p }) }),
                }}
                tableActionsRight={
                    <select value={pageSize} className="action-btn-select" onChange={(e) => navigate({ search: (prev) => ({ ...prev, pageSize: Number(e.target.value), page: 1 }) })}>
                        {[10, 20, 50, 100].map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                }
            />

            <CreateServiceModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSuccess={() => navigate({ search: (prev) => ({ ...prev, page: 1 }) })}
            />
        </div>
    );
}
