import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { DataTable } from "@/components/table/DataTable";
import type { SortRule, FilterRule } from "@/components/table/DataTable";
import { Route } from "@/routes/_protected/_admin/users";
import UploadContactsModal from "./UploadContactsModal";
import { useUsers } from "@/pages/users/data-access/useFetchData.tsx";
import type { Users } from "@/pages/users/data-access/types.ts";

// -------------------- Column Definitions --------------------
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
          <span style={{
            display: "inline-block", padding: "4px 10px", borderRadius: 5,
            backgroundColor: bgColor, color: "#fff", fontWeight: 500, minWidth: 70, textAlign: "center"
          }}>
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
];

// -------------------- GetUsersPage Component --------------------
export default function GetUsersPage() {
  // 1. Get validated search params from URL
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  // 2. Parse the 'sort' string from URL into the format DataTable expects
  const sortBy: SortRule[] = useMemo(() => {
    if (!search.sort) return [];
    return search.sort.split(",").map((s) => {
      const [column, direction = "asc"] = s.split(":");
      return { column: column as keyof Users, direction: direction as "asc" | "desc" };
    });
  }, [search.sort]);

  // 3. Fetch data (Hook re-runs automatically when 'search' changes)
  const { data, isLoading, isError, error, refetch } = useUsers(search);

  // 4. Centralized navigation helper
  const updateSearch = (next: Partial<typeof search>) => {
    navigate({
      search: (prev) => ({ ...prev, ...next }),
      replace: true, // Use replace to avoid polluting history with every filter keystroke
    });
  };

  const handleSortApply = (rules: SortRule[]) => {
    const sortString = rules.map((r) => `${r.column}:${r.direction}`).join(",");
    updateSearch({ sort: sortString, page: 1 });
  };

  const handleFilterApply = (rules: FilterRule[]) => {
    // Reset all filter keys to undefined, then apply new ones
    const filterParams: any = {
      page: 1,
      first_name: undefined,
      last_name: undefined,
      user_email: undefined,
      role_name: undefined,
      is_active: undefined
    };

    rules.forEach((r) => {
      if (r.value !== "" && r.value !== undefined) {
        filterParams[r.column] = String(r.value);
      }
    });

    updateSearch(filterParams);
  };

  const handlePageChange = (p: number) => updateSearch({ page: p });

  return (
      <>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h1>Users</h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={() => navigate({ to: "/users/create-user" })}>
              New User
            </button>
            <button className="btn btn-secondary" onClick={() => setUploadModalOpen(true)}>
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
              page: search.page,
              pageSize: search.pageSize,
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
