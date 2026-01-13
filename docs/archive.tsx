import { useMemo } from "react";
import { DataTable } from "@/components/table/DataTable";
import { useFetchTemplates } from "./hooks/useFetchTemplates";
import type { NotificationTemplate } from "./types";

export default function NotificationTemplatesPage() {
  const { data, isLoading, isError, error, refetch } = useFetchTemplates();

  // Extract templates array for table
  const templates = useMemo<NotificationTemplate[]>(() => data?.data ?? [], [data?.data]);
  const total = data?.total_count ?? 0;

  // Table columns
  const columns = [
    { id: "notification_template_id", caption: "ID", size: 60 },
    { id: "subject_template", caption: "Subject", size: 200 },
    { id: "event_type", caption: "Event Type", size: 150 },
    { id: "template_syntax", caption: "Syntax", size: 120 },
    { id: "date_created", caption: "Created At", size: 160, renderCell: (v: string) => new Date(v).toLocaleString() },
    {
      id: "actions",
      caption: "Actions",
      size: 100,
      renderCell: (_: any, row: NotificationTemplate) => (
        <button
          className="view-button"
          onClick={() => alert(`Editing template: ${row.subject_template}`)}
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <h1 className="page-header">Notification Templates</h1>

      <DataTable
        columns={columns}
        data={templates}
        isLoading={isLoading}
        error={isError ? (error as any)?.message : undefined}
        onRefresh={refetch}
        pagination={{
          page: 1,
          pageSize: total,
          total,
          onPageChange: () => {}, // no pagination controls needed
        }}
      />
    </div>
  );
}
