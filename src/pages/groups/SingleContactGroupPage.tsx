import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import { DataTable } from "@/components/table/DataTable";
import type { ColumnProps } from "@/components/table/DataTable";
import { useState } from "react";
import { toast } from "react-hot-toast";
import AddMembersModal from "./AddMembersModal";
import AddServicesModal from "./AddServicesModal";
import "@/css/singleService.css";

export default function SingleContactGroupPage() {
  const { uuid } = useParams({ from: SingleContactGroupPage.id });
  const [openMembersModal, setOpenMembersModal] = useState(false);
  const [openServicesModal, setServicesModal] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["contactGroup", uuid],
    queryFn: async () => {
      if (!uuid) throw new Error("Missing UUID");

      const response = await axiosClient.get(`/contacts/group?uuid=${uuid}`);
      const record = response.data?.data;
      if (!record) throw new Error("Contact group not found");
      return record;
    },
    enabled: !!uuid,
  });

  if (isError) return <div className="error">Error: {(error as any)?.message}</div>;
  if (!data) return <div className="error">No contact group found</div>;

  const group = data;

  const membersColumns: ColumnProps<any>[] = [
    { id: "first_name", caption: "First Name", size: 120 },
    { id: "last_name", caption: "Last Name", size: 120 },
    {
      id: "contacts",
      caption: "Contacts",
      size: 250,
      renderCell: (contacts: any[]) =>
        contacts.map((c) => `${c.type}: ${c.value}`).join(", "),
    },
  ];

  const servicesColumns: ColumnProps<any>[] = [
    { id: "monitored_service_name", caption: "Service Name", size: 200 },
    { id: "uuid", caption: "UUID", size: 240, hide: true },
  ];

  const channelsColumns: ColumnProps<any>[] = [
    { id: "notification_channel_name", caption: "Channel Name", size: 200 },
    { id: "notification_channel_code", caption: "Code", size: 120 },
  ];

  return (
    <>

      <div className="page-header">
        <h1>{group.contact_group_name}</h1>
      </div>
      <section className="service-section">
        <h3>Group Info</h3>
        <div className="service-grid">
          <div>
            <strong>Description:</strong> {group.contact_group_description}
          </div>

        </div>
      </section>

      <section className="service-section">
        <div className="header-group">
          <h3>Members</h3>
          <button className="btn-primary" onClick={() => setOpenMembersModal(true)}>Add Members</button>
        </div>

        <DataTable
          columns={membersColumns}
          data={group.members}
          isLoading={isLoading}
          enableFilter={false}
          enableSort={false}
          enableRefresh={false}
        />
      </section>

      <section className="service-section">
        <div className="header-group">
          <h3>Monitored Services</h3>
          <button className="btn-primary" onClick={() => setServicesModal(true)}>Add Services</button>
        </div>

        <DataTable
          columns={servicesColumns}
          data={group.monitored_services || []}
          isLoading={isLoading}
          enableFilter={false}
          enableSort={false}
          enableRefresh={false}
        />
      </section>

      <section className="service-section">
        <h3>Notification Channels</h3>
        <DataTable
          columns={channelsColumns}
          data={group.notification_channels || []}
          isLoading={isLoading}
          enableFilter={false}
          enableSort={false}
          enableRefresh={false}
        />
      </section>

      {/* Modals */}
      <AddMembersModal
        isOpen={openMembersModal}
        onClose={() => setOpenMembersModal(false)}
        groupUuid={group.uuid}
        currentMembers={group.members}
        onSuccess={() => {
          toast.success("Members added successfully");
          refetch();
        }}
        onError={(msg: string) => toast.error(`Failed to add members: ${msg}`)}
      />

      <AddServicesModal
        isOpen={openServicesModal}
        onClose={() => setServicesModal(false)}
        groupUuid={group.uuid}
        currentServices={group.monitored_services}
        onSuccess={() => {
          toast.success("Services added successfully");
          refetch();
        }}
        onError={(msg: string) => toast.error(`Failed to add services: ${msg}`)}
      />
    </>
  );
}
