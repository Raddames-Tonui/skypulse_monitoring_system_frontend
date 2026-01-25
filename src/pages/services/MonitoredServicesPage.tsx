import { useState, useMemo } from "react";
import { useNavigate, getRouteApi } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/table/DataTable";
import { useAuth } from "@/context/data-access/types.ts";
import axiosClient from "@/utils/constants/axiosClient";
import type { MonitoredService } from "@/pages/services/data-access/types.ts";

const routeApi = getRouteApi('/_protected/services/');

const FILTER_KEY_MAP: Record<string, string> = {
  monitored_service_name: "name",
  is_active: "active",
  ssl_enabled: "ssl",
  last_uptime_status: "status",
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

const fetchServices = async (params: Record<string, string | number>) => {
  const { data } = await axiosClient.get("/services", { params });
  return data;
};

export default function MonitoredServicesPage() {
  // FIX: Bind navigate to this specific route to fix the 'never' type error
  const navigate = useNavigate({ from: routeApi.fullPath });
  const { user } = useAuth();
  const search = routeApi.useSearch();

  const [page, setPage] = useState(search.page);
  const [pageSize, setPageSize] = useState(search.pageSize);

  const sortBy = useMemo(() => {
    if (!search.sort) return [];
    return search.sort.split(",").map((s) => {
      const [column, direction = "asc"] = s.split(":");
      return { column, direction: direction as "asc" | "desc" };
    });
  }, [search.sort]);

  const filters = useMemo(() => {
    const keys = Object.keys(FILTER_KEY_MAP);
    return keys
        .map((key) => ({ column: key, value: search[key as keyof typeof search] }))
        .filter((f) => f.value !== undefined && f.value !== "") as { column: string; value: string }[];
  }, [search]);

  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = { page, pageSize };
    filters.forEach((f) => {
      const backendKey = FILTER_KEY_MAP[f.column] || f.column;
      if (f.value) params[backendKey] = f.value;
    });
    if (sortBy.length) {
      params.sort = sortBy
          .map((r) => `${SORT_KEY_MAP[r.column] ?? r.column}:${r.direction}`)
          .join(",");
    }
    return params;
  }, [page, pageSize, filters, sortBy]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["services", queryParams],
    queryFn: () => fetchServices(queryParams),
  });

  const services: MonitoredService[] = useMemo(() => data?.data ?? [], [data?.data]);

  const columns = [
    { id: "monitored_service_id", caption: "ID", size: 50, isSortable: true, isFilterable: true },
    { id: "monitored_service_name", caption: "Name", size: 200, isSortable: true, isFilterable: true },
    {
      id: "monitored_service_url",
      caption: "Service URL",
      size: 250,
      isSortable: false,
      isFilterable: false,
      renderCell: (value: string) => (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {value}
          </a>
      ),
    },
    {
      id: "ssl_enabled",
      caption: "SSL Enabled",
      size: 120,
      align: "center" as const,
      isSortable: true,
      isFilterable: true,
      renderCell: (v: boolean) => (v ? "Yes" : "No"),
    },
    {
      id: "last_uptime_status",
      caption: "Status",
      size: 120,
      isSortable: true,
      isFilterable: true,
      renderCell: (status: string) => {
        const normalizedStatus = (status ?? "").toUpperCase();
        let bgColor = "#e74c3c";
        if (normalizedStatus === "UP") bgColor = "#27ae60";
        else if (normalizedStatus === "MAINTENANCE") bgColor = "#f1c40f";
        return (
            <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 5, backgroundColor: bgColor, color: "#fff", fontWeight: 600, textAlign: "center", minWidth: 70 }}>
              {normalizedStatus}
            </span>
        );
      },
    },
    {
      id: "date_created",
      caption: "Created At",
      size: 160,
      isSortable: true,
      renderCell: (v: string) => new Date(v).toISOString().split("T")[0],
    },
    {
      id: "actions",
      caption: "Actions",
      size: 100,
      isSortable: false,
      isFilterable: false,
      renderCell: (_: any, row: MonitoredService) => (
          <button className="action-btn" onClick={() => navigate({ to: "/services/$uuid", params: { uuid: row.uuid } })}>
            View
          </button>
      ),
    },
  ];

  const tableActionsRight = (
      <select
          value={pageSize}
          className="action-btn-select"
          onChange={(e) => {
            const nextSize = Number(e.target.value);
            setPageSize(nextSize);
            navigate({ search: (prev) => ({ ...prev, pageSize: nextSize, page: 1 }) });
          }}
      >
        {[10, 20, 50, 100].map((v) => (
            <option key={v} value={v}>{v}</option>
        ))}
      </select>
  );

  return (
      <div className="page-wrapper">
        <div className="page-header flex justify-between items-center mb-4">
          <h1>Monitored Services</h1>
          {user?.role_name !== "VIEWER" && (
              <button className="btn btn-secondary" onClick={() => navigate({ to: "/services/create" })}>
                New Service
              </button>
          )}
        </div>

        <DataTable<MonitoredService>
            columns={columns}
            data={services}
            isLoading={isLoading}
            error={isError ? (error as any)?.message : undefined}
            onRefresh={refetch}
            initialSort={sortBy}
            initialFilter={filters}
            onSortApply={(rules) => {
              const sortString = rules.map(r => `${r.column}:${r.direction}`).join(',');
              navigate({ search: (prev) => ({ ...prev, sort: sortString }) });
            }}
            onFilterApply={(rules) => {
              const cleanRules = rules.filter((f) => f.value);
              setPage(1);
              navigate({
                search: (prev) => {
                  // Use casting to bypass strict key validation while constructing the object
                  const nextSearch = { ...prev, page: 1 } as any;
                  // Reset filterable keys
                  Object.keys(FILTER_KEY_MAP).forEach(k => delete nextSearch[k]);
                  // Re-apply active rules
                  cleanRules.forEach(r => (nextSearch[r.column] = r.value));
                  return nextSearch;
                }
              });
            }}
            pagination={{
              page,
              pageSize,
              total: data?.total_count ?? 0,
              onPageChange: (p) => {
                setPage(p);
                navigate({ search: (prev) => ({ ...prev, page: p }) });
              },
            }}
            tableActionsRight={tableActionsRight}
        />
      </div>
  );
}
