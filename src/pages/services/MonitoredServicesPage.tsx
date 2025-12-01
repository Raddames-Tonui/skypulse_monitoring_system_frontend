import { useState } from "react";
import { DataTable } from "@/components/table/DataTable";
import Modal from "@/components/Modal";
import axiosClient from "@/utils/constants/axiosClient";
import { useQuery } from "@tanstack/react-query";

type FilterRule = { column: string; operator?: string; value: string };
type SortRule = { column: string; direction: "asc" | "desc" };

const FILTER_MAP: Record<string, string> = {
  entity: "a.entity",
  action: "a.action",
};

const SORT_MAP: Record<string, string> = {
  date: "a.date_created",
  entity: "a.entity",
  user: "u.first_name",
  action: "a.action",
};

const fetchAuditLogs = async (params: Record<string, string | number>) => {
  const { data } = await axiosClient.get("/services/logs/audit", { params });
  return data;
};

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sortBy, setSortBy] = useState<SortRule[]>([]);
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{ before_data?: any; after_data?: any } | null>(null);

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
    queryKey: ["audit-logs", queryParams],
    queryFn: () => fetchAuditLogs(queryParams),
  });

  const logs = data?.data || [];

  const columns = [
    {
      id: "user_email",
      caption: "User Email",
      size: 200,
      filterable: true,
      sortable: false,
    },
    {
      id: "user_full_name",
      caption: "Full Name",
      size: 180,
      filterable: true,
      sortable: true,
    },
    {
      id: "entity",
      caption: "Entity",
      size: 150,
      filterable: true,
      sortable: true,
    },
    {
      id: "action",
      caption: "Action",
      size: 120,
      filterable: true,
      sortable: true,
    },
    {
      id: "date_created",
      caption: "Date",
      size: 160,
      filterable: false,
      sortable: true,
      renderCell: (v: string) => new Date(v).toLocaleString(),
    },
    {
      id: "actions",
      caption: "Actions",
      size: 100,
      filterable: false,
      sortable: false,
      renderCell: (_: any, row: any) => (
        <button
          className="btn btn-sm btn-primary"
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
      {[10, 15, 20, 50].map((v) => (
        <option key={v} value={v}>
          {v}
        </option>
      ))}
    </select>
  );

  return (
    <div className="page-wrapper">
      <div className="page-header flex justify-between items-center mb-4">
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
        onFilterApply={(rules) => {
          setFilters(rules.filter((f) => f.value));
          setPage(1);
        }}
        pagination={{
          page,
          pageSize,
          total: data?.total_count || 0,
          onPageChange: setPage,
        }}
        tableActionsRight={tableActionsRight}
      />

      <Modal
        isOpen={isModalOpen}
        title="Audit Log Details"
        onClose={() => setModalOpen(false)}
        body={
          modalData ? (
            <div className="flex flex-col gap-4">
              <div>
                <h3>Before:</h3>
                <pre className="p-2 bg-gray-100 rounded">{JSON.stringify(modalData.before_data, null, 2)}</pre>
              </div>
              <div>
                <h3>After:</h3>
                <pre className="p-2 bg-gray-100 rounded">{JSON.stringify(modalData.after_data, null, 2)}</pre>
              </div>
            </div>
          ) : null
        }
      />
    </div>
  );
}
