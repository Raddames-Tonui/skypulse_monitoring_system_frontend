import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/table/DataTable";
import axiosClient from "@/utils/constants/axiosClient";
import Modal from "@/components/Modal";
import DynamicForm from "@/components/dynamic-form/DynamicForm";
import { toast } from "react-hot-toast";
import type { SortRule, FilterRule } from "@/components/table/DataTable";
import { createGroupSchema } from "@/components/dynamic-form/FormSchema";

const SORT_MAP: Record<string, string> = {
  contact_group_name: "contact_group_name",
  date_modified: "date_modified",
  members_count: "members_count",
  services_count: "services_count",
};

const FILTER_MAP: Record<string, string> = {
  contact_group_name: "contact_group_name",
  is_deleted: "is_deleted",
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
  const [isModalOpen, setModalOpen] = useState(false);

  const queryParams: Record<string, string | number> = { page, pageSize };
  filters.forEach((f) => {
    if (f.value !== undefined && f.value !== null && f.value !== "") {
      queryParams[FILTER_MAP[f.column] ?? f.column] = f.value;
    }
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

  const groups = data?.data ?? [];

  const columns = [
    { id: "uuid", caption: "UUID", size: 240, hide: true },
    { id: "contact_group_id", caption: "ID", size: 40,  },
    {
      id: "contact_group_name",
      caption: "Group Name",
      size: 200,
      isSortable: true,
      isFilterable: true,
    },
    {
      id: "contact_group_description",
      caption: "Description",
      size: 250,
      isSortable: true,
    },
    {
      id: "members_count",
      caption: "Members",
      size: 120,
      isSortable: true,
    },
    {
      id: "services_count",
      caption: "Services",
      size: 120,
      isSortable: true,
    },
    {
      id: "date_modified",
      caption: "Modified",
      size: 180,
      isSortable: true,
      renderCell: (v: string) => new Date(v).toLocaleString(),
    },
    {
      id: "is_deleted",
      caption: "Deleted",
      size: 100,
      isSortable: true,
      renderCell: (v: boolean) => (v ? "Yes" : "No"),
      isFilterable: true,
      filterType: "dropdown",
    },
    {
      id: "actions",
      caption: "Actions",
      size: 160,
      renderCell: (_: any, row: any) => (
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={() =>
              navigate({
                to: "/groups/$uuid",
                params: { uuid: row.uuid },
              })
            }
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const tableActionsRight = (
    <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
      {[10, 20, 50, 100].map((v) => (
        <option key={v} value={v}>
          {v}
        </option>
      ))}
    </select>
  );

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const res = await axiosClient.post("/contacts/groups", values);
      toast.success(res.data?.message || "Group created successfully");
      setModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create group");
    }
  };

  return (
    <>
      <div className="page-header flex justify-between items-center mb-4">
        <h1>Contact Groups</h1>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          New Contact Group
        </button>
      </div>

      <DataTable
        columns={columns}
        data={groups}
        isLoading={isLoading}
        error={isError ? (error as any)?.message : undefined}
        onRefresh={refetch}
        initialSort={sortBy}
        initialFilter={filters}
        onSortApply={setSortBy}
        onFilterApply={(rules) => {
          setFilters(rules.filter((f) => f.value !== ""));
          setPage(1);
        }}
        pagination={{ page, pageSize, total: data?.total_count ?? 0, onPageChange: setPage }}
        tableActionsRight={tableActionsRight}
      />

      <Modal
        isOpen={isModalOpen}
        title="Create Contact Group"
        onClose={() => setModalOpen(false)}
        body={
          <DynamicForm
            schema={{
              ...createGroupSchema,
              fields: Object.fromEntries(
                Object.entries(createGroupSchema.fields).map(([key, field]) => [
                  key,
                  {
                    ...(field as Record<string, any>),
                    props: {
                      ...((field as Record<string, any>).props),
                      className:
                        key === "description"
                          ? "textarea-large"
                          : (field as Record<string, any>).props?.className,
                    },
                  },
                ])
              ),
            }}
            initialData={{}}
            onSubmit={handleSubmit}
            className="form-wrapper"
            fieldClassName="form-field"
            buttonClassName="submit-button"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          />
        }
      />
    </>
  );
}
