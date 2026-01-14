import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useUsers } from "@/hooks/hooks";
import { DataTable, SortRule, FilterRule } from "@/components/table/DataTable";
import type { ApiResponse, Users } from "@/utils/types";
import { Route } from "@/routes/_protected/_admin/users";
import UploadContactsModal from "./UploadContactsModal";

/**
 * FRONTEND COLUMN → BACKEND COLUMN
 * (URL uses frontend keys ONLY)
 */
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

/**
 * Columns
 */
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
    isFilterable: true,
    renderCell: (v: boolean) => (v ? "Yes" : "No"),
    size: 80,
  },
  {
    id: "date_created",
    caption: "Created At",
    isSortable: true,
    renderCell: (v: string) => new Date(v).toLocaleString(),
    size: 180,
    hide: true,
  },
  {
    id: "date_modified",
    caption: "Modified At",
    isSortable: true,
    renderCell: (v: string) => new Date(v).toLocaleString(),
    size: 180,
    hide: true,
  },
] as const;

export default function GetUsers() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  /**
   * Parse sort from URL
   * URL example: ?sort=first_name:asc,last_name:desc
   */
  const initialSort: SortRule<Users>[] = search.sort
    ? search.sort.split(",").map((s) => {
        const [column, direction = "asc"] = s.split(":");
        return {
          column: column as keyof Users,
          direction: direction as "asc" | "desc",
        };
      })
    : [];

  const [sortBy, setSortBy] = useState<SortRule<Users>[]>(initialSort);
  const [filters, setFilters] = useState<FilterRule<Users>[]>([]);
  const [page, setPage] = useState(Number(search.page) || 1);
  const [pageSize, setPageSize] = useState(Number(search.pageSize) || 20);

  /**
   * Build URL + backend query params
   * URL stays CLEAN (frontend keys only)
   */
  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page,
      pageSize,
    };

    // sort=first_name:asc
    if (sortBy.length) {
      params.sort = sortBy
        .map((r) => `${r.column}:${r.direction}`)
        .join(",");
    }

    // first_name=John
    filters.forEach((f) => {
      if (f.value !== "" && f.value !== undefined) {
        params[f.column] = String(f.value);
      }
    });

    return params;
  }, [page, pageSize, sortBy, filters]);

  /**
   * Sync URL
   */
  useEffect(() => {
    navigate({ search: queryParams });
  }, [queryParams]);

  /**
   * Fetch data
   */
  const { data, isLoading, isError, error, refetch } =
    useUsers<ApiResponse<Users>>(queryParams);

  /**
   * Handlers
   */
  const handleSortApply = (rules: SortRule<Users>[]) => {
    setSortBy(rules);
  };

  const handleFilterApply = (rules: FilterRule<Users>[]) => {
    setFilters(rules.filter((r) => r.value !== "" && r.value !== undefined));
    setPage(1);
  };

  const handlePageChange = (p: number) => setPage(p);

  return (
    <>
      <div className="page-header">
        <h1>Users</h1>
        <div>
          <button
            className="btn btn-secondary"
            onClick={() => navigate({ to: "/users/create-user" })}
          >
            New User
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setUploadModalOpen(true)}
          >
            Add Contacts
          </button>
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

      {isUploadModalOpen && (
        <UploadContactsModal
          isOpen={isUploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
        />
      )}
    </>
  );
}
