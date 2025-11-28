import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/table/DataTable";
import NavigationBar from "@/components/NavigationBar";
import axiosClient from "@/utils/constants/axiosClient";
import type { SortRule, FilterRule } from "@/components/table/DataTable";

const SORT_MAP: Record<string, string> = {
  contact_group_name: "name",
  contact_group_description: "description",
  date_created: "created",
  date_modified: "modified",
  members_count: "members",
  services_count: "services",
};

const FILTER_MAP: Record<string, string> = {
  contact_group_name: "name",
};

const fetchContactGroups = async (params: Record<string, string | number>) => {
  const { data } = await axiosClient.get("/contacts/groups", { params });
  return data;
};

export default function ContactGroupsPage() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortRule[]>([]);
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

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
    queryKey: ["contact-groups", queryParams],
    queryFn: () => fetchContactGroups(queryParams),
  });

  const groups = useMemo(() => data?.data ?? [], [data?.data]);

  const columns = [
    { id: "uuid", caption: "UUID", size: 240, hide: false },
    { id: "contact_group_name", caption: "Group Name", isSortable: true, isFilterable: true },
    { id: "contact_group_description", caption: "Description", size: 250, isSortable: true },
    { id: "members_count", caption: "Members", size: 100, isSortable: true },
    { id: "services_count", caption: "Services", size: 100, isSortable: true },
    {
      id: "date_modified",
      caption: "Modified",
      isSortable: true,
      size: 180,
      renderCell: (v) => new Date(v).toLocaleString(),
    },
    {
      id: "actions",
      caption: "Actions",
      size: 160,
      renderCell: (_, row: any) => (
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={() =>
              navigate({
                to: "/groups/$uuid",
                params: { uuid: row.uuid }
              })
            }
          >
            View
          </button>
        </div>
      ),
    }
  ];

  const updateUrl = useCallback(() => {
    const params: Record<string, any> = { page, pageSize };
    if (sortBy.length)
      params.sort = sortBy
        .map((r) => `${SORT_MAP[r.column] ?? r.column}:${r.direction}`)
        .join(",");
    filters.forEach((f) => {
      if (f.value) params[FILTER_MAP[f.column] ?? f.column] = f.value;
    });
    navigate({ search: params });
  }, [page, pageSize, sortBy, filters, navigate]);

  useEffect(() => updateUrl(), [updateUrl]);

  const handleSortApply = (rules: SortRule[]) => setSortBy(rules);
  const handleFilterApply = (rules: FilterRule[]) => {
    setFilters(rules.filter((f) => f.value));
    setPage(1);
  };
  const handlePageChange = (p: number) => setPage(p);
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const tableActionsRight = (
    <select value={pageSize} onChange={(e) => handlePageSizeChange(Number(e.target.value))}>
      {[10, 20, 50, 100].map((v) => (
        <option key={v} value={v}>
          {v}
        </option>
      ))}
    </select>
  );

  return (
    <>
      <div className="page-header">
        <h1>Contact Groups</h1>
        <button>Create New Service</button>
      </div>

      <DataTable
        columns={columns}
        data={groups}
        isLoading={isLoading}
        error={isError ? (error as any)?.message : undefined}
        onRefresh={refetch}
        initialSort={sortBy}
        initialFilter={filters}
        onSortApply={handleSortApply}
        onFilterApply={handleFilterApply}
        pagination={{ page, pageSize, total: data?.total_count ?? 0, onPageChange: handlePageChange }}
        tableActionsRight={tableActionsRight}
      />
    </>
  );
}
