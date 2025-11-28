import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/_protected/services";

import { DataTable } from "@/components/table/DataTable";
import Modal from "@/components/Modal";
import DynamicForm from "@/components/dynamic-form/DynamicForm";
import { monitoredServiceFormSchema } from "@/components/dynamic-form/FormSchema";


import type { MonitoredService } from "@/utils/types";
import Loader from "@/components/Loader";
import { useMonitoredServices, useUpdateService } from "@/hooks/hooks";

export default function MonitoredServicesPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();

  const [isModalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Record<string, any> | null>(null);

  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;

  const { data, isLoading, refetch } = useMonitoredServices({
    page,
    pageSize,
  });

  const updateService = useUpdateService();

  const normalizeRow = (row: MonitoredService) => ({
    monitored_service_name: row.monitored_service_name || "",
    monitored_service_url: row.monitored_service_url || "",
    monitored_service_region: row.monitored_service_region || "",
    check_interval: row.check_interval ?? "",
    retry_count: row.retry_count ?? "",
    retry_delay: row.retry_delay ?? "",
    expected_status_code: row.expected_status_code ?? "",
    ssl_enabled: row.ssl_enabled ?? true,
    uuid: row.uuid, 
  });


  const openEditModal = (row: MonitoredService) => {
    if (!row) return;
    setEditData(normalizeRow(row));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditData(null);
  };

  const renderCell = (cellData: any) => {
    const row: MonitoredService = cellData?.row || cellData;
    return (
      <button className="button-secondary" onClick={() => openEditModal(row)}>
        Edit
      </button>
    );
  };


  const columns = [
    { id: "monitored_service_name", caption: "Name", size: 150 },
    { id: "monitored_service_url", caption: "URL", size: 250 },
    { id: "monitored_service_region", caption: "Region", size: 100 },
    { id: "check_interval", caption: "Interval", size: 80 },
    {
      id: "is_active",
      caption: "Active",
      size: 80,
      renderCell: (v: boolean) => (v ? "Yes" : "No"),
    },
    {
      id: "last_uptime_status",
      caption: "Status",
      size: 100,
      renderCell: (v: string) => {
        const color = v === "UP" ? "green" : v === "DOWN" ? "red" : "gray";
        return <span style={{ color, fontWeight: "bold" }}>{v}</span>;
      },
    },
    {
      id: "date_created",
      caption: "Created",
      size: 120,
      renderCell: (v: string) => new Date(v).toLocaleDateString(),
    },
    {
      id: "actions",
      caption: "Actions",
      size: 80,
      renderCell,
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Monitored Services</h1>
        <Link to="/services/create"> Create Service </Link>

      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <DataTable<MonitoredService>
          columns={columns}
          data={data?.data || []}
          pagination={{
            page,
            pageSize,
            total: data?.total_count || 0,
            onPageChange: (newPage) =>
              navigate({ search: { ...searchParams, page: newPage } }),
          }}
          onRefresh={refetch}
        />
      )}

    
      <Modal
        isOpen={isModalOpen}
        title="Update Monitored Service"
        onClose={closeModal}
        body={
          <DynamicForm
            schema={monitoredServiceFormSchema}
            initialData={editData || {}}
            onSubmit={(values) => {
              if (editData?.uuid) {
                updateService.mutate(
                  { ...values, uuid: editData.uuid },
                  { onSuccess: closeModal }
                );
              }
            }}
            className="dynamic-form-wrapper"
            fieldClassName="form-field-wrapper"
            buttonClassName="form-buttons-wrapper"
            style={{ maxWidth: "800px", margin: "0 auto" }}
          />
        }
      />
    </div>
  );
}
