import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Route } from "@/routes/_protected/services";
import { DataTable } from "@/components/table/DataTable";
import { sortData } from "@/components/table/utils/tableUtils";
import type { ColumnProps, SortRule, FilterRule } from "@/components/table/DataTable";
import type { MonitoredService } from "@/utils/types";
import axiosClient from "@/utils/constants/axiosClient";

interface MonitoredServicesResponse {
  data: MonitoredService[];
  total_count: number;
  current_page: number;
  page_size: number;
  last_page: number;
}

// --- Backend short names mapping ---
const FILTER_MAP: Record<string, string> = {
  monitored_service_name: "name",
  monitored_service_region: "region",
  is_active: "active",
  ssl_enabled: "ssl",
};

const SORT_MAP: Record<string, string> = {
  monitored_service_name: "name",
  monitored_service_url: "url",
  monitored_service_region: "region",
  check_interval: "interval",
  date_created: "created",
  last_checked: "checked",
  is_active: "active",
  last_uptime_status: "status",
};

const fetchMonitoredServices = async (params: Record<string, string | number>) => {
  const { data } = await axiosClient.get<MonitoredServicesResponse>("/services", { params });
  return data;
};

export default function MonitoredServicesPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  // --- Initial sort & pagination ---
  const initialSort: SortRule[] = searchParams.sort
    ? searchParams.sort.split(",").filter(Boolean).map((s) => {
      const [column, direction = "asc"] = s.trim().split(":"); 
      return { column: column as keyof MonitoredService, direction: direction as "asc" | "desc" };
    })
    : [];

  const initialPage = Number(searchParams.page) || 1;
  const initialPageSize = Number(searchParams.pageSize) || 10;

  // --- State ---
  const [sortBy, setSortBy] = useState<SortRule[]>(initialSort);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [filters, setFilters] = useState<FilterRule[]>([]);

  // --- Build query params for backend ---
  const queryParams: Record<string, string | number> = { page, pageSize };
  filters.forEach((f) => {
    if (f.value) {
      const shortName = FILTER_MAP[f.column as keyof MonitoredService] ?? f.column;
      queryParams[shortName] = f.value;
    }
  });
  if (sortBy.length) {
    queryParams.sort = sortBy
      .map((r) => {
        const shortName = SORT_MAP[r.column as keyof MonitoredService] ?? r.column;
        return `${shortName}:${r.direction}`;
      })
      .join(",");
  }

  // --- TanStack Query ---
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["monitored-services", queryParams],
    queryFn: () => fetchMonitoredServices(queryParams),
  });

  // --- Sorted data (frontend fallback) ---
  const sortedServices = useMemo(() => {
    const services = data?.data ?? [];
    return sortData(services, sortBy);
  }, [data?.data, sortBy]);

  // --- Table columns ---
  const columns: ColumnProps<MonitoredService>[] = [
    { id: "id", caption: "ID", size: 5, isSortable: true },
    { id: "monitored_service_name", caption: "Name", size: 150, isSortable: true, isFilterable: true },
    { id: "monitored_service_url", caption: "URL", size: 250, isSortable: true, isFilterable: true },
    { id: "monitored_service_region", caption: "Region", size: 100, isSortable: true, isFilterable: true },
    { id: "check_interval", caption: "Interval", size: 80, isSortable: true, isFilterable: true },
    {
      id: "is_active",
      caption: "Active",
      size: 80,
      isSortable: true,
      isFilterable: true,
      renderCell: (value) => (value ? "Yes" : "No"),
    },
    {
      id: "last_uptime_status",
      caption: "Status",
      size: 100,
      isSortable: true,
      renderCell: (value) => {
        const color = value === "UP" ? "green" : value === "DOWN" ? "red" : "gray";
        return <span style={{ color, fontWeight: "bold" }}>{value}</span>;
      },
    },
    {
      id: "date_created",
      caption: "Created",
      size: 120,
      isSortable: true,
      renderCell: (v) => new Date(v as string).toLocaleDateString(),
    },
  ];

  // --- Update URL query ---
  const updateUrl = useCallback(() => {
    const params: Record<string, string | number> = { page, pageSize };
    filters.forEach((f) => {
      if (f.value) {
        const shortName = FILTER_MAP[f.column as keyof MonitoredService] ?? f.column;
        params[shortName] = f.value;
      }
    });
    if (sortBy.length) {
      params.sort = sortBy
        .map((r) => {
          const shortName = SORT_MAP[r.column as keyof MonitoredService] ?? r.column;
          return `${shortName}:${r.direction}`;
        })
        .join(",");
    }
    navigate({ search: params });
  }, [page, pageSize, sortBy, filters, navigate]);

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  // --- Handlers ---
  const handleSortApply = (rules: SortRule[]) => setSortBy(rules);
  const handleFilterApply = (rules: FilterRule[]) => {
    setFilters(rules.filter((f) => f.value));
    setPage(1);
  };
  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const tableActionsRight = (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <select
        value={pageSize}
        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
        className="button-sec"
        style={{ padding: "0.4rem 1rem" }}
      >
        {[5, 10, 20].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1>Monitored Services</h1>
      </div>
      <div className="table-wrapper">
        <DataTable
          columns={columns}
          data={sortedServices}
          isLoading={isLoading}
          error={isError ? (error as any)?.message : undefined}
          onRefresh={refetch}
          initialSort={sortBy}
          initialFilter={filters}
          onSortApply={handleSortApply}
          onFilterApply={handleFilterApply}
          tableActionsRight={tableActionsRight}
          pagination={{
            page,
            pageSize,
            total: data?.total_count ?? 0,
            onPageChange: handlePageChange,
          }}
        />
      </div>
    </div>
  );
}
