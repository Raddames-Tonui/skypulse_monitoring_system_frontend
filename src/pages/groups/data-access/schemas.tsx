import { type ColumnProps } from "@components/table/DataTable.tsx";
import type { ContactGroupMember, ContactGroupContact, ContactGroupService } from "@/pages/groups/data-access/types.ts";
import toast from "react-hot-toast";

export const getMembersColumns = (
    removeMemberMutation: any,
    setPrimaryMutation: any,
    refetch: () => void
): ColumnProps<ContactGroupMember>[] => [
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

export const contactsColumns: ColumnProps<ContactGroupContact>[] = [
    { id: "type", caption: "Type", size: 120 },
    { id: "value", caption: "Value", size: 200 },
];

export const getServicesColumns = (
    removeServiceMutation: any,
    refetch: () => void
): ColumnProps<ContactGroupService>[] => [
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
