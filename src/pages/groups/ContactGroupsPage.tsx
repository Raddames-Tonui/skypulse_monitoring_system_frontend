import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/table/DataTable";
import axiosClient from "@/utils/constants/axiosClient";
import Modal from "@/components/modal/Modal";
import DynamicForm from "@/components/dynamic-form/DynamicForm";
import { toast } from "react-hot-toast";
import { createGroupSchema } from "@components/dynamic-form/utils/FormSchema.ts";
import { Route } from "@/routes/_protected/_admin/groups";

const SORT_MAP: Record<string, string> = {
  contact_group_name: "contact_group_name",
  date_modified: "date_modified",
  members_count: "members_count",
  services_count: "services_count",
};

const fetchContactGroups = async (params: Record<string, any>) => {
  const { data } = await axiosClient.get("/contacts/groups", { params });
  return data;
};

export default function ContactGroupsPage() {
  const queryClient = useQueryClient();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [isModalOpen, setModalOpen] = useState(false);

  const { page, pageSize, sort, ...filtersFromUrl } = search;

  const sortBy = useMemo(() => {
    if (!sort) return [];
    return sort.split(',').map(s => {
      const [column, direction] = s.split(':');
      return { column, direction: direction as 'asc' | 'desc' };
    });
  }, [sort]);

  const filters = useMemo(() => {
    return Object.entries(filtersFromUrl).map(([column, value]) => ({
      column,
      value: value as string,
    }));
  }, [filtersFromUrl]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["contact-groups", search],
    queryFn: () => fetchContactGroups(search),
  });

  const createMutation = useMutation({
    mutationFn: async (values: Record<string, any>) => {
      const res = await axiosClient.post("/contacts/groups", values);
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res?.message || "Group created successfully");
      queryClient.invalidateQueries({ queryKey: ["contact-groups"] });
      setModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create group");
    },
  });

  const groups = data?.data ?? [];

  const columns = [
    { id: "uuid", caption: "UUID", size: 240, hide: true },
    { id: "contact_group_id", caption: "ID", size: 40 },
    { id: "contact_group_name", caption: "Group Name", size: 200, isSortable: true, isFilterable: true },
    { id: "contact_group_description", caption: "Description", size: 250, isSortable: true },
    { id: "members_count", caption: "Members", size: 120, isSortable: true },
    { id: "services_count", caption: "Services", size: 120, isSortable: true },
    {
      id: "date_modified",
      caption: "Modified",
      size: 180,
      hide: true,
      isSortable: true,
      renderCell: (v: string) => new Date(v).toLocaleString(),
    },
    {
      id: "is_deleted",
      caption: "Status",
      size: 100,
      isSortable: true,
      renderCell: (v: boolean) => (v ? "Inactive" : "Active"),
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
                className="action-btn"
                onClick={() => navigate({ to: "/groups/$uuid", params: { uuid: row.uuid } })}
            >
              View
            </button>
          </div>
      ),
    },
  ];

  const customizedSchema = {
    ...createGroupSchema,
    fields: Object.fromEntries(
        Object.entries(createGroupSchema.fields).map(([key, field]) => [
          key,
          {
            ...(field as any),
            props: {
              ...(field as any).props,
              className: key === "description" ? "textarea-large" : (field as any).props?.className,
            },
          },
        ])
    ),
  };

  const tableActionsRight = (
      <select
          className="action-btn-select"
          value={pageSize}
          onChange={(e) => navigate({ search: (prev) => ({ ...prev, pageSize: Number(e.target.value), page: 1 }) })}
      >
        {[10, 20, 50, 100].map((v) => (
            <option key={v} value={v}>{v}</option>
        ))}
      </select>
  );

  return (
      <>
        <div className="page-header flex justify-between items-center mb-4">
          <h1>Contact Groups</h1>
          <button className="btn btn-secondary" onClick={() => setModalOpen(true)}>
            New Group
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
            onSortApply={(rules) => {
              const sortStr = rules.map(r => `${SORT_MAP[r.column] ?? r.column}:${r.direction}`).join(",");
              navigate({ search: (prev) => ({ ...prev, sort: sortStr || undefined, page: 1 }) });
            }}
            onFilterApply={(rules) => {
              const filterParams: Record<string, any> = {};
              rules.forEach(f => { if (f.value !== "") filterParams[f.column] = f.value; });

              navigate({
                search: (prev) => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { contact_group_name, is_deleted, ...rest } = prev;
                  return { ...rest, ...filterParams, page: 1 };
                }
              });
            }}
            pagination={{
              page,
              pageSize,
              total: data?.total_count ?? 0,
              onPageChange: (newPage) => navigate({ search: (prev) => ({ ...prev, page: newPage }) }),
            }}
            tableActionsRight={tableActionsRight}
        />

        <Modal
            isOpen={isModalOpen}
            title="Create Contact Group"
            size="md"
            onClose={() => setModalOpen(false)}
            body={
              <DynamicForm
                  schema={customizedSchema}
                  initialData={{}}
                  showButtons={false}
                  onSubmit={(values) => createMutation.mutate(values)}

              />
            }
            footer={
              <div className="flex gap-3 justify-end">
                <button
                    type="submit"
                    form={createGroupSchema.id}
                    className="btn-primary"
                    disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Save"}
                </button>
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            }
        />
      </>
  );
}
