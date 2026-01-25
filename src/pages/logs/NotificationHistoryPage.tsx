import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/table/DataTable";
import axiosClient from "@/utils/constants/axiosClient";
import Modal from "@/components/modal/Modal";
import type { NotificationHistory } from "./data-access/types";



const fetchNotificationHistory = async (
    params: Record<string, string | number>
) => {
    const { data } = await axiosClient.get(
        "/notifications/history",
        { params }
    );
    return data;
};


function MessagePreviewModal({ html }: { html: string }) {
    return (
        <div
            className="notification-preview"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}


export default function NotificationHistoryPage() {
    const [sortBy, setSortBy] = useState<any[]>([]);
    const [filters, setFilters] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);

    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

    const queryParams = useMemo(() => {
        const params: Record<string, string | number> = { page, pageSize };

        filters.forEach((f) => {
            if (f.value !== "" && f.value !== null && f.value !== undefined) {
                params[f.column] = f.value;
            }
        });

        if (sortBy.length) {
            params.sort = sortBy
                .map((r) => `${r.column}:${r.direction}`)
                .join(",");
        }

        return params;
    }, [page, pageSize, filters, sortBy]);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["notification-history", queryParams],
        queryFn: () => fetchNotificationHistory(queryParams),
    });

    const rows: NotificationHistory[] = data?.data ?? [];


    const columns = [
        { id: "notification_history_id", caption: "ID", size: 60 },

        {
            id: "subject",
            caption: "Subject",
            size: 150,
            isSortable: true,
        },

        {
            id: "recipient",
            caption: "Recipient",
            size: 240,
            isFilterable: true,
        },

        {
            id: "status",
            caption: "Status",
            size: 120,
            isSortable: true,
            isFilterable: true,
            renderCell: (v: string) => {
                const status = (v ?? "").toUpperCase();

                const bgColor = status === "SENT" ? "#27ae60" : "#e74c3c";

                return (
                    <span
                        style={{
                            display: "inline-block",
                            padding: "2px 12px",
                            borderRadius: "5px",
                            backgroundColor: bgColor,
                            color: "#fff",
                            fontWeight: 400,
                            textAlign: "center",
                            minWidth: 60,
                        }}
                    >
                        {status}
                    </span>
                );
            },
        },
        
        {
            id: "sent_at",
            caption: "Sent At",
            size: 180,
            isSortable: true,
            renderCell: (v: string | null) =>
                v ? new Date(v).toLocaleString() : "—",
        },

        {
            id: "actions",
            caption: "Actions",
            size: 80,
            renderCell: (_: any, row: NotificationHistory) => (
                <button
                    className="action-btn"
                    onClick={() => {
                        setSelectedMessage(row.message);
                        setModalOpen(true);
                    }}
                >
                    View
                </button>
            ),
        },
    ];


    return (
        <div>
            <div className="page-header">
                <h1>Notification History</h1>
            </div>

            <DataTable
                columns={columns}
                data={rows}
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
                        className="action-btn-select"
                        onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                        {[10, 15, 20, 50, 1000].map((v) => (
                            <option key={v} value={v}>
                                {v}
                            </option>
                        ))}
                    </select>
                }
            />

            <Modal
                isOpen={isModalOpen}
                title="Notification Message"
                onClose={() => setModalOpen(false)}
                body={
                    selectedMessage ? (
                        <MessagePreviewModal html={selectedMessage} />
                    ) : null
                }
                size="lg"
                showCloseButton={true}
            />
        </div>
    );
}
