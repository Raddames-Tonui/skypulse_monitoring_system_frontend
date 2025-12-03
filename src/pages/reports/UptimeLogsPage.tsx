import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/table/DataTable";
import type { SortRule, FilterRule } from "@/components/table/DataTable";
import axiosClient from "@/utils/constants/axiosClient";
import NavigationBar from "@/components/NavigationBar";
import type { UptimeLogsResponse } from "@/context/types";
import { Route } from "@/routes/_protected/reports/uptime-reports";
import { useUptimeReportDownload } from "@/hooks/hooks";


const SORT_MAP: Record<string, string> = {
    monitored_service_name: "service",
    status: "status",
    response_time_ms: "response",
    http_status: "code",
    checked_at: "checked",
    date_created: "created",
    is_active: "active",
    ssl_enabled: "ssl",
};

const FILTER_MAP: Record<string, string> = {
    monitored_service_name: "service",
    region: "region",
    status: "status",
    is_active: "active",
    ssl_enabled: "ssl",
};

const fetchUptimeLogs = async (params: Record<string, string | number>) => {
    const { data } = await axiosClient.get<UptimeLogsResponse>("/services/logs/uptime", { params });
    return data;
};

export default function UptimeLogsPage() {
    const searchParams = Route.useSearch();
    const navigate = useNavigate();

    const initialSort: SortRule[] = searchParams.sort
        ? searchParams.sort.split(",").filter(Boolean).map((s) => {
            const [key, dir = "asc"] = s.split(":");
            const col = Object.keys(SORT_MAP).find((k) => SORT_MAP[k] === key);
            return {
                column: (col ?? key) as keyof UptimeLog,
                direction: dir as "asc" | "desc",
            };
        })
        : [];

    const initialPage = Number(searchParams.page) || 1;
    const initialPageSize = Number(searchParams.pageSize) || 20;

    const [sortBy, setSortBy] = useState<SortRule[]>(initialSort);
    const [filters, setFilters] = useState<FilterRule[]>([]);
    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);



    const queryParams: Record<string, string | number> = { page, pageSize };
    filters.forEach((f) => {
        if (f.value) queryParams[FILTER_MAP[f.column] ?? f.column] = f.value;
    });
    if (sortBy.length) {
        queryParams.sort = sortBy
            .map((r) => `${SORT_MAP[r.column] ?? r.column}:${r.direction}`)
            .join(",");
    }

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["uptime-logs", queryParams],
        queryFn: () => fetchUptimeLogs(queryParams),
    });

    const logs = useMemo(() => data?.data ?? [], [data?.data]);

    const columns = [
        { id: "uptime_log_id", caption: "ID", size: 80 },
        { id: "monitored_service_name", caption: "Service", isSortable: true, isFilterable: true, size: 150 },
        {
            id: "status",
            caption: "Status",
            isSortable: true,
            isFilterable: true,
            renderCell: (v) => <span style={{ color: v === "UP" ? "green" : "red", fontWeight: "bold" }}>{v}</span>,
            size: 80,
        },
        { id: "response_time_ms", caption: "Response Time (ms)", isSortable: true, size: 120 },
        { id: "http_status", caption: "HTTP Status", isSortable: true, isFilterable: false, size: 80 },
        { id: "region", caption: "Region", isSortable: false, isFilterable: false, size: 100, hide: true },
        {
            id: "checked_at",
            caption: "Checked",
            isSortable: true,
            renderCell: (v: string) => new Date(v as string).toLocaleString(),
            size: 180,
        },
        {
            id: "error_message",
            caption: "Error",
            size: 200,
            renderCell: (v: null | string) => v ?? "-",
        },
    ];

    const updateUrl = useCallback(() => {
        const params: Record<string, any> = { page, pageSize };
        if (sortBy.length)
            params.sort = sortBy.map((r) => `${SORT_MAP[r.column] ?? r.column}:${r.direction}`).join(",");
        filters.forEach((f) => {
            if (f.value) params[FILTER_MAP[f.column] ?? f.column] = f.value;
        });
        navigate({ search: params });
    }, [page, pageSize, sortBy, filters, navigate]);

    useEffect(() => updateUrl(), [updateUrl]);

    // --- Handlers
    const handleSortApply = (rules: SortRule[]) => setSortBy(rules);
    const handleFilterApply = (rules: FilterRule[]) => {
        setFilters(rules.filter((f) => f.value));
        setPage(1);
    };
    const handlePageChange = (p: number) => setPage(p);
    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setPage(1);
    };

    const tableActionsRight = (
        <select value={pageSize} onChange={(e) => handlePageSizeChange(Number(e.target.value))}>
            {[10, 20, 50, 100].map((v) => (
                <option key={v} value={v}>
                    {v}
                </option>
            ))}
        </select>
    );

    const { isProcessing, downloadReport, previewReport } = useUptimeReportDownload();

    const tableActionsLeft = (
        <div style={{ display: "flex", gap: "0.5rem" }}>
            <button  className="action-btn-sec" onClick={previewReport} disabled={isProcessing}>
                Preview PDF
            </button>
            <button  className="action-btn-sec" onClick={downloadReport} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Download PDF"}
            </button>
        </div>
    );

    const links = [
        { label: "Uptime Reports", to: "/reports/uptime-reports", match: (p) => p.includes("uptime-reports") },
        { label: "SSL Reports", to: "/reports/ssl-reports", match: (p) => p.includes("ssl-reports") },
    ];

    return (
        <>
            <div className="page-header">
                <h1>Uptime Reports</h1>
                <NavigationBar links={links} />
            </div>

            <DataTable
                columns={columns}
                data={logs}
                isLoading={isLoading}
                error={isError ? (error as any)?.message : undefined}
                onRefresh={refetch}
                initialSort={sortBy}
                initialFilter={filters}
                onSortApply={handleSortApply}
                onFilterApply={handleFilterApply}
                pagination={{ page, pageSize, total: data?.total_count ?? 0, onPageChange: handlePageChange }}
                tableActionsRight={tableActionsRight}
                tableActionsLeft={tableActionsLeft}
            />
        </>
    );
}