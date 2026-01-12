import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/table/DataTable";
import axiosClient from "@/utils/constants/axiosClient";
import Modal from "@/components/modal/Modal";
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

type DiffRow = {
    key: string;
    before: any;
    after: any;
};

function buildDiff(before: any = {}, after: any = {}) {
    const keys = new Set([
        ...Object.keys(before || {}),
        ...Object.keys(after || {}),
    ]);

    return Array.from(keys)
        .map((key) => ({
            key,
            before: before?.[key],
            after: after?.[key],
        }))
        .filter((r) => JSON.stringify(r.before) !== JSON.stringify(r.after));
}

function AuditDiffTable({ diffs }: { diffs: DiffRow[] }) {
    if (!diffs.length) return <em>No field changes</em>;

    return (
        <table className="audit-diff-table">
            <thead>
                <tr className="audit-diff-header">
                    <th>Field</th>
                    <th>Before</th>
                    <th>After</th>
                </tr>
            </thead>
            <tbody>
                {diffs.map((d) => (
                    <tr key={d.key}>
                        <td className="audit-diff-key">{d.key}</td>
                        <td className="audit-diff-before">
                            {d.before === undefined ? "—" : String(d.before)}
                        </td>
                        <td className="audit-diff-after">
                            {d.after === undefined ? "—" : String(d.after)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function AuditModalBody({
    data,
}: {
    data: { before_data?: any; after_data?: any };
}) {
    const [showRaw, setShowRaw] = useState(false);

    const diffs = useMemo(
        () => buildDiff(data.before_data, data.after_data),
        [data]
    );

    const isCreate =
        !data.before_data || Object.keys(data.before_data || {}).length === 0;

    return (
        <div className="audit-modal-content">
            {isCreate ? (
                <>
                    <h3 className="dashboard-status-title">Created with</h3>
                    <table className="audit-created-table">
                        <tbody>
                            {Object.entries(data.after_data || {}).map(([k, v]) => (
                                <tr key={k}>
                                    <td className="audit-key">{k}</td>
                                    <td className="audit-value">{String(v)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <>
                    <h3 className="dashboard-status-title">Changes</h3>
                    <AuditDiffTable diffs={diffs} />
                </>
            )}

            <div className={{`margin-top 10px`}}>
                <button
                    className="view-button"
                    onClick={() => setShowRaw((v) => !v)}
                >
                    {showRaw ? "Hide raw JSON" : "View raw JSON"}
                </button>
            </div>

            {showRaw && (
                <div className="audit-json-grid">
                    <TreeView data={data.before_data || {}} name="Before" />
                    <TreeView data={data.after_data || {}} name="After" />
                </div>
            )}
        </div>
    );
}

const fetchAuditLogs = async (params: Record<string, string | number>) => {
    const { data } = await axiosClient.get("/services/logs/audit", { params });
    return data;
};

export default function AuditLogsPage() {
    const [sortBy, setSortBy] = useState<any[]>([]);
    const [filters, setFilters] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState<{
        before_data?: any;
        after_data?: any;
    } | null>(null);

    const queryParams = useMemo(() => {
        const params: Record<string, string | number> = { page, pageSize };
        filters.forEach((f) => {
            if (f.value !== "" && f.value !== null && f.value !== undefined) {
                params[f.column] = f.value;
            }
        });
        if (sortBy.length) {
            params.sort = sortBy.map((r) => `${r.column}:${r.direction}`).join(",");
        }
        return params;
    }, [page, pageSize, filters, sortBy]);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["audit-logs", queryParams],
        queryFn: () => fetchAuditLogs(queryParams),
    });

    const logs: AuditLog[] = data?.data ?? [];

    const columns = [
        { id: "audit_log_id", caption: "ID", size: 60 },
        { id: "user_full_name", caption: "Full Name", size: 180, isSortable: true },
        { id: "user_email", caption: "User Email", size: 220 },
        { id: "entity", caption: "Entity", size: 150, isSortable: true, isFilterable: true },
        { id: "action", caption: "Action", size: 120, isSortable: true, isFilterable: true },
        {
            id: "date_created",
            caption: "Date",
            size: 180,
            isSortable: true,
            renderCell: (v: string) => new Date(v).toLocaleString(),
        },
        {
            id: "actions",
            caption: "Actions",
            size: 140,
            renderCell: (_: any, row: AuditLog) => (
                <button
                    className="view-button"
                    onClick={() => {
                        setModalData({
                            before_data: row.before_data,
                            after_data: row.after_data,
                        });
                        setModalOpen(true);
                    }}
                >
                    View Changes
                </button>
            ),
        },
    ];

    return (
        <div>
            <div className="page-header">
                <h1>Audit Logs</h1>
            </div>

            <DataTable
                columns={columns}
                data={logs}
                isLoading={isLoading}
                error={isError ? (error as any)?.message : undefined}
                onRefresh={refetch}
                initialSort={sortBy}
                initialFilter={filters}
                onSortApply={setSortBy}
                onFilterApply={(rules: any[]) => {
                    setFilters(rules);
                    setPage(1);
                }}
                pagination={{
                    page,
                    pageSize,
                    total: data?.total_count ?? 0,
                    onPageChange: setPage,
                }}
                tableActionsRight={
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                        {[10, 15, 20, 50, 100].map((v) => (
                            <option key={v} value={v}>
                                {v}
                            </option>
                        ))}
                    </select>
                }
            />

            <Modal
                isOpen={isModalOpen}
                title="Audit Log Details"
                onClose={() => setModalOpen(false)}
                body={modalData ? <AuditModalBody data={modalData} /> : null}
                size="lg"
            />
        </div>
    );
}
