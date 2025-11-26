import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/_protected/services";
import { DataTable } from "@/components/table/DataTable";
import { sortData } from "@/components/table/utils/tableUtils";
import type { ColumnProps, SortRule, FilterRule } from "@/components/table/DataTable";
import { useMonitoredServices } from "@/hooks/useMonitoredServices";
import type { MonitoredService } from "@/utils/types";
import { useDebounce } from "@/hooks/useDebounce"; // assume you have a debounce hook

export default function MonitoredServicesPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  // --- Initial sort & pagination ---
  const initialSort: SortRule[] = searchParams.sortBy
    ? searchParams.sortBy.split(",").filter(Boolean).map((s) => {
        const [column, direction = "asc"] = s.trim().split(" ");
        return { column, direction: direction as "asc" | "desc" };
      })
    : [];

  const initialPage = Number(searchParams.page) || 1;
  const initialPageSize = Number(searchParams.pageSize) || 10;

  // --- State ---
  const [sortBy, setSortBy] = useState<SortRule[]>(initialSort);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Filters: start empty
  const [filters, setFilters] = useState<FilterRule[]>([]);

  // --- Backend query params ---
  const rawParams: Record<string, string | number> = { page, pageSize };

  filters.forEach((f) => {
    if (f.value) {
      rawParams[f.column] = f.value; // only include non-empty filters
    }
  });

  // --- Debounce filters & params ---
  const debouncedParams = useDebounce(rawParams, 400);

  const { data, isLoading, isError, error, refetch } = useMonitoredServices(debouncedParams);

  const sortedServices = useMemo(() => {
    const services = data?.records ?? [];
    return sortData(services, sortBy);
  }, [data?.records, sortBy]);

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
        let color = "gray";
        if (value === "UP") color = "green";
        else if (value === "DOWN") color = "red";
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
    navigate({
      search: {
        page,
        pageSize,
        sortBy: sortBy.map((r) => `${r.column} ${r.direction}`).join(","),
        ...filters
          .filter((f) => f.value)
          .reduce((acc, f) => ({ ...acc, [f.column]: f.value }), {}),
      },
    });
  }, [navigate, page, pageSize, sortBy, filters]);

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  // --- Handlers ---
  const handleSortApply = (rules: SortRule[]) => setSortBy(rules);
  const handleFilterApply = (rules: FilterRule[]) => {
    // Only store filters with values
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
          error={isError ? error?.message : undefined}
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
