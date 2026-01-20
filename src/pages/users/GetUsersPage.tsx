import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { DataTable } from "@/components/table/DataTable";
import type { SortRule, FilterRule } from "@/components/table/DataTable";
import { Route } from "@/routes/_protected/_admin/users";
import UploadContactsModal from "./UploadContactsModal";
import {useUsers} from "@/pages/users/data-access/useFetchData.tsx";
import type {Users} from "@/pages/users/data-access/types.ts";

// Mapping DB fields for filtering/sorting
const FILTER_MAP: Record<keyof Users, string> = {
  user_id: "u.user_id",
  uuid: "u.uuid",
  first_name: "u.first_name",
  last_name: "u.last_name",
  user_email: "u.user_email",
  role_id: "r.role_id",
  role_name: "r.role_name",
  company_id: "c.company_id",
  company_name: "c.company_name",
  is_active: "u.is_active",
  date_created: "u.date_created",
  date_modified: "u.date_modified",
};

const SORT_MAP = FILTER_MAP;

const columns = [
  { id: "user_id", caption: "ID", size: 80 },
  { id: "first_name", caption: "First Name", isSortable: true, isFilterable: true, size: 120 },
  { id: "last_name", caption: "Last Name", isSortable: true, isFilterable: true, size: 120 },
  { id: "user_email", caption: "Email", isSortable: true, isFilterable: true, size: 200 },
  {
    id: "role_name",
    caption: "Role",
    isSortable: true,
    isFilterable: true,
    size: 120,
    renderCell: (role: string) => {
      const normalizedRole = (role ?? "").toUpperCase();
      let bgColor = "#28a745";
      if (normalizedRole === "ADMIN") bgColor = "#e74c3c";
      else if (normalizedRole === "OPERATOR") bgColor = "#f1c40f";
      return (
        <span
          style={{
            display: "inline-block",
            padding: "4px 10px",
            borderRadius: 5,
            backgroundColor: bgColor,
            color: "#fff",
            fontWeight: 500,
            textAlign: "center",
            minWidth: 70,
          }}
        >
          {normalizedRole}
        </span>
      );
    },
  },
  { id: "company_name", caption: "Company", isSortable: true, size: 150 },
  {
    id: "is_active",
    caption: "Active",
    isSortable: true,
    isFilterable: true,
    renderCell: (v: boolean) => (v ? "Yes" : "No"),
    size: 80,
  },
  { id: "date_created", caption: "Created At", isSortable: true, renderCell: (v: string) => new Date(v).toLocaleString(), size: 180, hide: true },
  { id: "date_modified", caption: "Modified At", isSortable: true, renderCell: (v: string) => new Date(v).toLocaleString(), size: 180, hide: true },
] as const;

// Type for search params
type UsersSearch = {
  page?: number;
  pageSize?: number;
  sort?: string;
  [key: string]: any;
};

export default function GetUsers() {
  const search = Route.useSearch<UsersSearch>();
  const navigate = useNavigate();
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  const [page, setPage] = useState(search.page ?? 1);
  const [pageSize, setPageSize] = useState(search.pageSize ?? 20);

  // Initialize sort from query param
  const initialSort: SortRule[] = search.sort
    ? search.sort.split(",").map((s) => {
        const [column, direction = "asc"] = s.split(":");
        return { column: column as keyof Users, direction: direction as "asc" | "desc" };
      })
    : [];

  const [sortBy, setSortBy] = useState<SortRule[]>(initialSort);
  const [filters, setFilters] = useState<FilterRule[]>([]);

  // Build query params for API / URL
  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = { page, pageSize };
    if (sortBy.length) params.sort = sortBy.map((r) => `${r.column}:${r.direction}`).join(",");
    filters.forEach((f) => {
      if (f.value !== "" && f.value !== undefined) params[f.column] = String(f.value);
    });
    return params;
  }, [page, pageSize, sortBy, filters]);

  // Update URL query
  useEffect(() => {
    navigate({ search: queryParams });
  }, [queryParams, navigate]);

  const { data, isLoading, isError, error, refetch } = useUsers(queryParams);

  const handleSortApply = (rules: SortRule[]) => setSortBy(rules);
  const handleFilterApply = (rules: FilterRule[]) => {
    setFilters(rules.filter((r) => r.value !== "" && r.value !== undefined));
    setPage(1);
  };
  const handlePageChange = (p: number) => setPage(p);

  return (
    <>
      <div className="page-header">
        <h1>Users</h1>
        <div>
          <button className="btn btn-secondary" onClick={() => navigate({ to: "/users/create-user" })}>New User</button>
          <button className="btn btn-secondary" onClick={() => setUploadModalOpen(true)}>Add Contacts</button>
        </div>
      </div>

      <DataTable<Users>
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

      {isUploadModalOpen && <UploadContactsModal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} />}
    </>
  );
}
