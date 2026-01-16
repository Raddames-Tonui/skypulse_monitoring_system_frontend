import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/table/DataTable";
import axiosClient from "@/utils/constants/axiosClient";
import { useAuth } from "@/hooks/hooks";

type FilterRule = { column: string; operator?: string; value: string };
type SortRule = { column: string; direction: "asc" | "desc" };

const FILTER_MAP: Record<string, string> = {
  name: "monitored_service_name",
  region: "monitored_service_region",
  active: "is_active",
};

const SORT_MAP: Record<string, string> = {
  name: "monitored_service_name",
  date_created: "date_created",
  ssl: "ssl_enabled",
  status: "last_uptime_status",
};

const fetchServices = async (params: Record<string, string | number>) => {
  const { data } = await axiosClient.get("/services", { params });
  return data;
};

export default function MonitoredServicesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<SortRule[]>([]);
  const [filters, setFilters] = useState<FilterRule[]>([]);

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
    queryKey: ["services", queryParams],
    queryFn: () => fetchServices(queryParams),
  });

  const services = useMemo(() => data?.data ?? [], [data?.data]);

  const columns = [
    { id: "monitored_service_id", caption: "Id", size: 50, filterable: true, sortable: true },
    { id: "monitored_service_name", caption: "Name", size: 200, filterable: true, sortable: true },
    {
      id: "monitored_service_url",
      caption: "URL",
      size: 250,
      filterable: false,
      sortable: false,
      renderCell: (value: string) => (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#135a8aff", textDecoration: "underline" }}
        >
          {value}
        </a>
      ),
    },
    { id: "monitored_service_region", caption: "Region", size: 120, filterable: true, sortable: true },
    { id: "ssl_enabled", caption: "SSL Enabled", size: 120, filterable: true, sortable: true, renderCell: (v: boolean) => (v ? "Yes" : "No") },
    {
      id: "last_uptime_status", caption: "Status", size: 100, filterable: true, sortable: true,
      renderCell: (v: string) => <span style={{ color: v === "UP" ? "#27ae60" : "#e74c3c", fontWeight: 600 }}>{v}</span>
    },
    { id: "date_created", caption: "Created At", size: 160, sortable: true, renderCell: (v: string) => new Date(v).toISOString().split("T")[0] },
    {
      id: "actions",
      caption: "Actions",
      size: 100,
      filterable: false,
      sortable: false,
      renderCell: (_: any, row: any) => (
        <button
          className="action-btn"
          onClick={() =>
            navigate({
              to: "/services/$uuid",
              params: { uuid: row.uuid },
            })
          }
        >
          View
        </button>

      ),
    },
  ];

  const tableActionsRight = (
    <select value={pageSize}
      className="action-btn-select"
      onChange={(e) => setPageSize(Number(e.target.value))}>
      {[10, 20, 50, 100].map((v) => (
        <option key={v} value={v}>
          {v}
        </option>
      ))}
    </select>
  );

  return (
    <div className="page-wrapper">
      <div className="page-header flex justify-between items-center mb-4">
        <h1>Monitored Services</h1>
        {user?.role_name === "VIEWER" ? <> </> :
          <button className="btn btn-secondary"
            onClick={() => navigate({ to: "/services/create" })}
          >
            New Service
          </button>
        }

      </div>

      <DataTable
        columns={columns}
        data={services}
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
          total: data?.total_count ?? 0,
          onPageChange: setPage,
        }}
        tableActionsRight={tableActionsRight}
      />
    </div>
  );
}
