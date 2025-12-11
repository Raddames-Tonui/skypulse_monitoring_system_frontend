import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/table/DataTable";
import axiosClient from "@/utils/constants/axiosClient";
import Modal from "@/components/Modal";
import type { SortRule, FilterRule, ColumnProps } from "@/components/table/DataTable";
import TreeView from "@/components/TreeView";

type AuditLog = {
    audit_log_id: number;
    user_id: number;
    user_email: string;
    user_full_name: string;
    entity: string;
    entity_id: number;
    action: string;
    before_data?: any;
    after_data?: any;
    ip_address?: string;
    date_created: string;
};

const fetchAuditLogs = async (params: Record<string, string | number>) => {
    const { data } = await axiosClient.get("/services/logs/audit", { params });
    return data;
};

export default function AuditLogsPage() {
    const [sortBy, setSortBy] = useState<SortRule[]>([]);
    const [filters, setFilters] = useState<FilterRule[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState<{ before_data?: any; after_data?: any } | null>(null);

    const queryParams = useMemo(() => {
        const params: Record<string, string | number> = { page, pageSize };
        filters.forEach(f => {
            if (f.value !== "" && f.value !== null && f.value !== undefined) {
                params[f.column] = f.value;
            }
        });
        if (sortBy.length) {
            params.sort = sortBy.map(r => `${r.column}:${r.direction}`).join(",");
        }
        return params;
    }, [page, pageSize, filters, sortBy]);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["audit-logs", queryParams],
        queryFn: () => fetchAuditLogs(queryParams),
    });

    const logs: AuditLog[] = data?.data ?? [];

    const columns: ColumnProps<AuditLog>[] = [
        { id: "audit_log_id", caption: "ID", size: 50 },
        { id: "user_full_name", caption: "Full Name", size: 180, isSortable: true },
        { id: "user_email", caption: "User Email", size: 200 },
        { id: "entity", caption: "Entity", size: 150, isSortable: true, isFilterable: true },
        { id: "action", caption: "Action", size: 120, isSortable: true, isFilterable: true },
        {
            id: "date_created",
            caption: "Date",
            size: 160,
            isSortable: true,
            renderCell: (value: string) => new Date(value).toLocaleString(),
        },
        {
            id: "actions",
            caption: "Actions",
            size: 120,
            renderCell: (_: any, row: AuditLog) => (
                <button
                    className="view-button"
                    onClick={() => {
                        setModalData({ before_data: row.before_data, after_data: row.after_data });
                        setModalOpen(true);
                    }}
                >
                    View Changes
                </button>
            ),
        },
    ];

    const tableActionsRight = (
        <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
            {[10, 15, 20, 50, 100].map(v => (
                <option key={v} value={v}>{v}</option>
            ))}
        </select>
    );

    return (
        <div>
            <div className="page-header flex justify-between items-center mb-4">
                <h1>Audit Logs</h1>
            </div>

            <DataTable<AuditLog>
                columns={columns}
                data={logs}
                isLoading={isLoading}
                error={isError ? (error as any)?.message : undefined}
                onRefresh={refetch}
                initialSort={sortBy}
                initialFilter={filters.map(f => ({
                    column: f.column,
                    operator: f.operator || "eq",
                    value: f.value ?? "",
                }))}
                onSortApply={setSortBy}
                onFilterApply={rules => {
                    setFilters(rules.filter(r => r.column && r.value !== "").map(r => ({ ...r, operator: r.operator || "eq" })));
                    setPage(1);
                }}
                pagination={{ page, pageSize, total: data?.total_count ?? 0, onPageChange: setPage }}
                tableActionsRight={tableActionsRight}
            />

            <Modal
                isOpen={isModalOpen}
                title="Audit Log Details"
                onClose={() => setModalOpen(false)}
                body={
                    modalData ? (
                        <div className="flex flex-col gap-4 max-h-[70vh] overflow-auto">
                            <div>
                                <h3>Before:</h3>
                                {modalData.before_data && Object.keys(modalData.before_data).length > 0 ? (
                                    <TreeView data={modalData.before_data} name="Before Data" />
                                ) : (
                                    <em>Empty</em>
                                )}
                            </div>
                            <div>
                                <h3>After:</h3>
                                {modalData.after_data && Object.keys(modalData.after_data).length > 0 ? (
                                    <TreeView data={modalData.after_data} name="After Data" />
                                ) : (
                                    <em>Empty</em>
                                )}
                            </div>
                        </div>
                    ) : null
                }
            />

        </div>
    );
}
