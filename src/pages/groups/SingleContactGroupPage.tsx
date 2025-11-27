import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import { DataTable } from "@/components/table/DataTable";
import type { ColumnProps } from "@/components/table/DataTable";
import "@/css/singleService.css";

export default function SingleContactGroupPage() {
  const { uuid } = useParams<{ uuid: string }>();

  const { data, isLoading, isError, error } = useQuery({
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

  // Members table
  const membersColumns: ColumnProps<any>[] = [
    { id: "first_name", caption: "First Name", size: 120 },
    { id: "last_name", caption: "Last Name", size: 120 },
    { id: "contacts", caption: "Contacts", size: 250, renderCell: (contacts: any[]) =>
        contacts.map(c => `${c.type}: ${c.value}`).join(", ")
    },
  ];

  // Monitored services table
  const servicesColumns: ColumnProps<any>[] = [
    { id: "monitored_service_name", caption: "Service Name", size: 200 },
    { id: "uuid", caption: "UUID", size: 240, hide: true },
  ];

  // Notification channels table
  const channelsColumns: ColumnProps<any>[] = [
    { id: "notification_channel_name", caption: "Channel Name", size: 200 },
    { id: "notification_channel_code", caption: "Code", size: 120 },
  ];

  return (
    <div className="service-container">
      <header className="service-header">
        <h2>{group.contact_group_name}</h2>
      </header>

      <section className="service-section">
        <h3>Group Info</h3>
        <div className="service-grid">
          <div><strong>Description:</strong> {group.contact_group_description}</div>
          <div><strong>UUID:</strong> {group.uuid}</div>
        </div>
      </section>

      <section className="service-section">
        <h3>Members</h3>
        <DataTable
          columns={membersColumns}
          data={group.members}
          isLoading={isLoading}
          enableFilter={true}
          enableSort={true}
        />
      </section>

      <section className="service-section">
        <h3>Monitored Services</h3>
        <DataTable
          columns={servicesColumns}
          data={group.monitored_services || []}
          isLoading={isLoading}
          enableFilter={true}
          enableSort={true}
        />
      </section>

      <section className="service-section">
        <h3>Notification Channels</h3>
        <DataTable
          columns={channelsColumns}
          data={group.notification_channels || []}
          isLoading={isLoading}
          enableFilter={true}
          enableSort={true}
        />
      </section>
    </div>
  );
}
