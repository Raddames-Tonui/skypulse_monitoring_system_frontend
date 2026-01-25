import { DataTable } from "@/components/table/DataTable";
import { useFetchTemplates } from "./data-access/useFetchData";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import Modal from "@/components/modal/Modal";
import type { NotificationTemplate } from "./data-access/types";
import TemplatePreviewModal from "./TemplatePreviewModal";

function NotificationTemplatesPage() {
    const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
    const [view, setView] = useState<"rendered" | "raw">("rendered");

    const { data, isLoading, isError, error, refetch } = useFetchTemplates();

    const templates = useMemo<NotificationTemplate[]>(() => data?.data ?? [], [data?.data]);
    const total = data?.total_count ?? 0;

    const columns = [
        { id: "notification_template_id", caption: "ID", size: 60 },
        { id: "subject_template", caption: "Subject", size: 200 },
        { id: "event_type", caption: "Event Type", size: 150 },
        { id: "template_syntax", caption: "Syntax", size: 120 },
        {
            id: "date_created",
            caption: "Created At",
            size: 160,
            renderCell: (v: string) => new Date(v).toLocaleString(),
        },
        {
            id: "actions",
            caption: "Actions",
            size: 150,
            renderCell: (_: any, row: NotificationTemplate) => (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                        className="action-btn"
                        onClick={() => {
                            setSelectedTemplate(row);
                            setView("rendered");
                            setPreviewModalOpen(true);
                        }}
                    >
                        View
                    </button>
                    <Link
                        to="/templates/$uuid"
                        params={{ uuid: row.uuid }}
                        className="action-btn"
                        style={{ textDecoration: "none" }}
                    >
                        Edit
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="page-header">
                <h1>Notification Templates</h1>
            </div>

            <DataTable
                columns={columns}
                data={templates}
                isLoading={isLoading}
                error={isError ? (error as any)?.message : undefined}
                pagination={{
                    page: 1,
                    pageSize: total,
                    total,
                    onPageChange: () => {},
                }}
                enableFilter={false}
                enableSort={false}
                onRefresh={refetch}
            />

            <Modal
                isOpen={isPreviewModalOpen}
                title={selectedTemplate?.subject_template ?? "Template Preview"}
                onClose={() => setPreviewModalOpen(false)}
                size="lg"
                showCloseButton
                body={
                    selectedTemplate ? (
                        <TemplatePreviewModal
                            template={selectedTemplate}
                            view={view}
                        />
                    ) : null
                }
                footer={
                    selectedTemplate && (
                        <div className="template-toolbar">
                            <button
                                className="btn-secondary"
                                onClick={() => setView("rendered")}
                            >
                                Preview
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={() => setView("raw")}
                            >
                                Raw HTML
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={() =>
                                    navigator.clipboard.writeText(selectedTemplate.body_template)
                                }
                            >
                                Copy
                            </button>
                        </div>
                    )
                }
            />
        </>
    );
}

export default NotificationTemplatesPage;
