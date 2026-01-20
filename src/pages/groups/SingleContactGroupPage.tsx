import { useParams } from "@tanstack/react-router";
import { DataTable } from "@/components/table/DataTable";
import type { ColumnProps } from "@/components/table/DataTable";
import { useState } from "react";
import { toast } from "react-hot-toast";
import AddMembersModal from "./AddMembersModal";
import AddServicesModal from "./AddServicesModal";
import { useGetContactGroup, useGetContactGroupServices } from "@/pages/groups/data-access/useFetchData.tsx";
import type { ContactGroupMember, ContactGroupContact, ContactGroupService } from "@/pages/groups/data-access/types";
import "@/css/singleService.css";
import { useRemoveGroupMember, useSetPrimaryMember, useRemoveGroupService } from "@/pages/groups/data-access/useMutateData.tsx";

export default function SingleContactGroupPage() {
    const { uuid } = useParams({ from: SingleContactGroupPage.uuid });
    const [openMembersModal, setOpenMembersModal] = useState(false);
    const [openServicesModal, setServicesModal] = useState(false);
    const [activeTab, setActiveTab] = useState<"members" | "services" | "info">("members");

    const { data: group, isLoading: loadingGroup, isError, error, refetch } = useGetContactGroup(uuid || "");
    const { data: servicesData, isLoading: loadingServices, isError: servicesError } = useGetContactGroupServices(uuid || "");

    const removeMemberMutation = useRemoveGroupMember(group?.uuid || "");
    const setPrimaryMutation = useSetPrimaryMember(group?.uuid || "");
    const removeServiceMutation = useRemoveGroupService(group?.uuid || "");

    if (isError) return <div className="error">Error: {error?.message}</div>;
    if (!group) return <div className="error">No contact group found</div>;

    // -------------------- Columns --------------------
    const membersColumns: ColumnProps<ContactGroupMember>[] = [
        { id: "first_name", caption: "First Name", size: 120 },
        { id: "last_name", caption: "Last Name", size: 120 },
        { id: "email", caption: "Email", size: 200 },
        {
            id: "actions",
            caption: "Actions",
            size: 200,
            renderCell: (_value: string | number, member: ContactGroupMember) => {
                const handleSetPrimary = () => {
                    setPrimaryMutation.mutate(member.user_id, {
                        onSuccess: () => {
                            toast.success(`${member.first_name} set as primary`);
                            refetch();
                        },
                        onError: (err: any) => toast.error(err?.message || "Failed to set primary member"),
                    });
                };
                const handleRemove = () => {
                    removeMemberMutation.mutate(member.user_id, {
                        onSuccess: () => {
                            toast.success(`${member.first_name} removed from group`);
                            refetch();
                        },
                        onError: (err: any) => toast.error(err?.message || "Failed to remove member"),
                    });
                };
                return (
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button className="btn-small btn-primary" onClick={handleSetPrimary}>
                            Set as Primary
                        </button>
                        <button className="btn-small btn-danger" onClick={handleRemove}>
                            Remove
                        </button>
                    </div>
                );
            },
        },
    ];

    const contactsColumns: ColumnProps<ContactGroupContact>[] = [
        { id: "type", caption: "Type", size: 120 },
        { id: "value", caption: "Value", size: 200 },
    ];

    const servicesColumns: ColumnProps<ContactGroupService>[] = [
        { id: "monitored_service_name", caption: "Service Name", size: 200 },
        { id: "monitored_service_url", caption: "URL", size: 250 },
        { id: "last_uptime_status", caption: "Status", size: 100 },
        { id: "is_active", caption: "Active", size: 100 },
        {
            id: "actions",
            caption: "Actions",
            size: 120,
            renderCell: (_value: any, service: ContactGroupService) => {
                const handleRemoveService = () => {
                    removeServiceMutation.mutate(service.monitored_service_id, {
                        onSuccess: () => {
                            toast.success(`${service.monitored_service_name} removed from group`);
                            refetch();
                        },
                        onError: (err: any) => toast.error(err?.message || "Failed to remove service"),
                    });
                };
                return (
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button className="btn-small btn-danger" onClick={handleRemoveService}>
                            Remove
                        </button>
                    </div>
                );
            },
        },
    ];

    // -------------------- Render --------------------
    return (
        <>
            <div className="page-header">
                <h1>{group.contact_group_name}</h1>
                <div className="tab-buttons">
                    <button className={activeTab === "members" ? "active" : ""} onClick={() => setActiveTab("members")}>
                        Members
                    </button>
                    <button className={activeTab === "services" ? "active" : ""} onClick={() => setActiveTab("services")}>
                        Group Services
                    </button>
                    <button className={activeTab === "info" ? "active" : ""} onClick={() => setActiveTab("info")}>
                        Group Info
                    </button>
                </div>
            </div>

            {/* ---------- Members Tab ---------- */}
            {activeTab === "members" && (
                <section className="service-section">
                    <div className="header-group">
                        <h3>Members</h3>
                        <button className="btn-primary" onClick={() => setOpenMembersModal(true)}>
                            Add Members
                        </button>
                    </div>
                    <DataTable
                        columns={membersColumns}
                        data={group.members}
                        isLoading={loadingGroup}
                        enableFilter={false}
                        enableSort={false}
                        enableRefresh={false}
                    />
                </section>
            )}

            {/* ---------- Services Tab ---------- */}
            {activeTab === "services" && (
                <section className="service-section">
                    <h3>Group Services</h3>
                    {loadingServices && <div>Loading services...</div>}
                    {servicesError && <div className="error">Failed to load services</div>}
                    {servicesData && (
                        <DataTable
                            columns={servicesColumns}
                            data={servicesData.services}
                            isLoading={loadingServices}
                            enableFilter={false}
                            enableSort={false}
                            enableRefresh={false}
                        />
                    )}
                    <button className="btn-primary mt-2" onClick={() => setServicesModal(true)}>
                        Add Service
                    </button>
                </section>
            )}

            {/* ---------- Group Info Tab (Card) ---------- */}
            {activeTab === "info" && (
                <section className="service-section">
                    <div className="card">
                        <h3>Group Info</h3>
                        <div>
                            <div>
                                <strong>Description:</strong> {group.contact_group_description}
                            </div>
                            <div>
                                <strong>Primary Member:</strong> {group.primary_member || "N/A"}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ---------- Modals ---------- */}
            <AddMembersModal
                isOpen={openMembersModal}
                onClose={() => setOpenMembersModal(false)}
                groupUuid={group.uuid}
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
                currentServices={servicesData?.services || []}
                onSuccess={() => {
                    toast.success("Services added successfully");
                    refetch();
                }}
                onError={(msg: string) => toast.error(`Failed to add services: ${msg}`)}
            />
        </>
    );
}
