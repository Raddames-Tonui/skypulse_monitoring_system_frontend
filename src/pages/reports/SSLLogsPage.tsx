import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/table/DataTable";
import type { ColumnProps, SortRule, FilterRule } from "@/components/table/DataTable";
import axiosClient from "@/utils/constants/axiosClient";
import NavigationBar from "@/components/NavigationBar";
import type { SSLLogsResponse } from "@/context/types";
import { Route } from "@/routes/_protected/reports/ssl-reports";
import { useSslReportDownload } from "@/hooks/hooks";



const SORT_MAP: Record<string, string> = {
    last_checked: "checked",
    service_name: "service",
    domain: "domain",
    issuer_common_name: "issuer",
    expiry_date: "expiry",
    days_remaining: "days_remaining",
    chain_valid: "chain_valid",
};

const FILTER_MAP: Record<string, string> = {
    monitored_service_name: "service",
    domain: "domain",
    issuer_common_name: "issuer",
    chain_valid: "chain_valid",
};

const fetchSSLLogs = async (params: Record<string, string | number>) => {
    const { data } = await axiosClient.get<SSLLogsResponse>("/services/logs/ssl", { params });
    return data;
};

const parseIssuer = (issuer: string | null) => {
    if (!issuer) return {};
    const parts = issuer.split(",");
    const map: Record<string, string> = {};
    parts.forEach((p) => {
        const [k, v] = p.split("=", 2);
        if (k && v) map[k.trim()] = v.trim();
    });
    return {
        issuer_common_name: map["CN"],
        issuer_org: map["O"],
        issuer_country: map["C"],
    };
};

export default function SSLLogsPage() {
    const searchParams = Route.useSearch();
    const navigate = useNavigate();

    const initialSort: SortRule[] = searchParams.sort
        ? searchParams.sort.split(",").filter(Boolean).map((s) => {
            const [key, dir = "asc"] = s.split(":");
            const col = Object.keys(SORT_MAP).find((k) => SORT_MAP[k] === key);
            return { column: (col ?? key) as keyof SSLLog, direction: dir as "asc" | "desc" };
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
        queryKey: ["ssl-logs", queryParams],
        queryFn: () => fetchSSLLogs(queryParams),
    });

    const logs = useMemo(() => {
        return (data?.data ?? []).map((l) => ({ ...l, ...parseIssuer(l.issuer) }));
    }, [data?.data]);

    const columns: ColumnProps<SSLLog>[] = [
        { id: "ssl_log_id", caption: "ID", size: 50 },
        { id: "service_name", caption: "Service", isSortable: true, isFilterable: true, size: 150 },
        { id: "domain", caption: "Domain", isSortable: true, isFilterable: true, size: 200 },
        { id: "issuer_common_name", caption: "Issuer CN", isSortable: true, isFilterable: true, size: 150 },
        { id: "issuer_org", caption: "Issuer Org", size: 150 },
        { id: "issuer_country", caption: "Country", size: 50, align: "center" },
        {
            id: "expiry_date",
            caption: "Expiry",
            isSortable: true,
            size: 120,
            renderCell: (v) => (v ? new Date(v as string).toLocaleDateString() : "-"),
        },
        { id: "days_remaining", caption: "Days Remaining", isSortable: true, size: 100 },
        {
            id: "chain_valid",
            caption: "Chain Valid",
            isSortable: true,
            isFilterable: true,
            renderCell: (v) => (v ? "Yes" : "No"),
            size: 80,
            align: "center"
        },
        {
            id: "last_checked",
            caption: "Last Checked",
            isSortable: true,
            renderCell: (v) => new Date(v as string).toLocaleString(),
            size: 150,
        },
    ];

    const updateUrl = useCallback(() => {
        const params: Record<string, any> = { page, pageSize };
        if (sortBy.length) {
            params.sort = sortBy
                .map((r) => `${SORT_MAP[r.column] ?? r.column}:${r.direction}`)
                .join(",");
        }
        filters.forEach((f) => {
            if (f.value) {
                params[FILTER_MAP[f.column] ?? f.column] = f.value;
            }
        });
        navigate({ search: params });
    }, [page, pageSize, sortBy, filters, navigate]);

    useEffect(() => updateUrl(), [updateUrl]);

    const handleSortApply = (rules: SortRule[]) => setSortBy(rules);
    const handleFilterApply = (rules: FilterRule[]) => {
        setFilters(rules.filter((f) => f.value));
        setPage(1);
    };
    const handlePage = (p: number) => setPage(p);
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

    const { isProcessing, downloadReport, previewReport } = useSslReportDownload();

    const tableActionsLeft = (
        <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={previewReport} disabled={isProcessing}>
                Preview PDF
            </button>
            <button onClick={downloadReport} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Download PDF"}
            </button>
        </div>
    );

    const links = [
        { label: "Uptime Reports", to: "/reports/uptime-reports", match: (p) => p.includes("uptime-reports") },
        { label: "SSL Reports", to: "/reports/ssl-reports", match: (p) => p.includes("ssl-reports") },
    ];
    return (
        <div>
            <div className="page-header">
                <h1>SSL Reports</h1>
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
                pagination={{
                    page,
                    pageSize,
                    total: data?.total_count ?? 0,
                    onPageChange: handlePage,
                }}
                tableActionsRight={tableActionsRight}
                tableActionsLeft={tableActionsLeft}
                enableRefresh={false}
            />
        </div>
    );
}