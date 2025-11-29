import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/_protected/users";
import { useUsers } from "@/hooks/hooks";
import { DataTable } from "@/components/table/DataTable";
import type { SortRule, FilterRule } from "@/context/types";
import type { ApiResponse, Users } from "@/utils/types";


const FILTER_MAP: Record<string, string> = {
  first_name: "u.first_name",
  last_name: "u.last_name",
  email: "u.user_email",
  role: "r.role_name",
  company: "c.company_name",
  active: "u.is_active",
};

const SORT_MAP: Record<string, string> = {
  first_name: "u.first_name",
  last_name: "u.last_name",
  email: "u.user_email",
  role: "r.role_name",
  company: "c.company_name",
  active: "u.is_active",
  created: "u.date_created",
  modified: "u.date_modified",
};

const columns = [
  { id: "user_id", caption: "ID", size: 80 },
  { id: "first_name", caption: "First Name", isSortable: true, isFilterable: true, size: 120 },
  { id: "last_name", caption: "Last Name", isSortable: true, isFilterable: true, size: 120 },
  { id: "user_email", caption: "Email", isSortable: true, isFilterable: true, size: 200 },
  { id: "role_name", caption: "Role", isSortable: true, isFilterable: true, size: 120 },
  { id: "company_name", caption: "Company", isSortable: true, size: 150 },
  {
    id: "is_active",
    caption: "Active",
    isSortable: true,
    renderCell: (v: boolean) => (v ? "Yes" : "No"),
    size: 80,
  },
  {
    id: "date_created",
    caption: "Created At",
    isSortable: true,
    renderCell: (v: string) => new Date(v).toLocaleString(),
    size: 180,
  },
  {
    id: "date_modified",
    caption: "Modified At",
    isSortable: true,
    renderCell: (v: string) => new Date(v).toLocaleString(),
    size: 180,
  },
];

export default function GetUsers() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const initialSort: SortRule[] = search.sort
    ? search.sort.split(",").map((s) => {
      const [key, dir = "asc"] = s.split(":");
      const col = Object.keys(SORT_MAP).find((k) => SORT_MAP[k] === key);
      return { column: col ?? key, direction: dir as "asc" | "desc" };
    })
    : [];

  const initialPage = Number(search.page) || 1;
  const initialPageSize = Number(search.pageSize) || 20;

  const [sortBy, setSortBy] = useState<SortRule[]>(initialSort);
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = { page, pageSize };

    if (sortBy.length) {
      params.sort = sortBy
        .map((r) => `${SORT_MAP[r.column] ?? r.column}:${r.direction}`)
        .join(",");
    }

    filters.forEach((f) => {
      if (f.value) params[FILTER_MAP[f.column] ?? f.column] = f.value;
    });

    return params;
  }, [page, pageSize, sortBy, filters]);

  useEffect(() => {
    navigate({ search: queryParams });
  }, [queryParams]);

  const { data, isLoading, isError, error, refetch } = useUsers<ApiResponse<Users>>(queryParams);

  // Handlers
  const handleSortApply = (rules: SortRule[]) => setSortBy(rules);
  const handleFilterApply = (rules: FilterRule[]) => {
    setFilters(rules.filter((r) => r.value));
    setPage(1);
  };
  const handlePageChange = (p: number) => setPage(p);

  return (
    <>
      <div className="page-header">
        <h1>Users</h1>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={isError ? (error as any)?.message : undefined}
        onRefresh={refetch}
        initialSort={sortBy}
        onSortApply={handleSortApply}
        onFilterApply={handleFilterApply}
        pagination={{
          page,
          pageSize,
          total: data?.total_count ?? 0,
          onPageChange: handlePageChange,
        }}
      />
    </>

  );
}