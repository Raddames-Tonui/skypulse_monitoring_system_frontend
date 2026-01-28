import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/table/DataTable";
import AddMembersModal from "./AddMembersModal";
import AddServicesModal from "./AddServicesModal";
import {
    useGetContactGroup,
    useGetContactGroupServices,
} from "@/pages/groups/data-access/useFetchData.tsx";
import {
    useRemoveGroupMember,
    useSetPrimaryMember,
    useRemoveGroupService, useToggleGroupStatus,
} from "@/pages/groups/data-access/useMutateData.tsx";
import {
    getMembersColumns,
    getServicesColumns,
} from "@/pages/groups/data-access/schemas.tsx";
import Loader from "@components/layout/Loader.tsx";
import "@/css/singleService.css";
import type {ContactGroupData} from "@/pages/groups/data-access/types.ts";

type GroupSearch = {
    tab?: "members" | "services" | "info";
};

export const Route = createFileRoute("/_protected/_admin/groups/$uuid")({
    component: SingleContactGroupPage,
    validateSearch: (search: Record<string, unknown>): GroupSearch => ({
        tab: (search.tab as GroupSearch["tab"]) || "info",
    }),
});

export default function SingleContactGroupPage() {
    const { uuid } = Route.useParams();
    const { tab } = Route.useSearch();
    const navigate = Route.useNavigate();
    const { mutate, isPending } = useToggleGroupStatus();



    const [openMembersModal, setOpenMembersModal] = useState(false);
    const [openServicesModal, setServicesModal] = useState(false);

    const handleToggle = (group: ContactGroupData) => {
        mutate({
            uuid: group.uuid,
            is_deleted: !group.is_deleted
        });
    };

    const {
        data: group,
        isPending: pendingGroup,
        isError,
        error,
        refetch,
    } = useGetContactGroup(uuid);

    const {
        data: servicesData,
        isPending: pendingServices,
    } = useGetContactGroupServices(uuid);

    const removeMemberMutation = useRemoveGroupMember(group?.uuid ?? "");
    const setPrimaryMutation = useSetPrimaryMember(group?.uuid ?? "");
    const removeServiceMutation = useRemoveGroupService(group?.uuid ?? "");

    const setActiveTab = (newTab: GroupSearch["tab"]) =>
        navigate({ search: (prev) => ({ ...prev, tab: newTab }) });


    if (pendingGroup) {
        return <Loader />;
    }

    if (isError) {
        return (
            <div className="error">
                Error: {error?.message || "Failed to load contact group"}
            </div>
        );
    }


    const membersCols = getMembersColumns(
        removeMemberMutation,
        setPrimaryMutation,
        refetch
    );

    const servicesCols = getServicesColumns(
        removeServiceMutation,
        refetch
    );

    return (
        <>
            <div className="page-header">
                <h1>{group?.contact_group_name}</h1>

                <div className="tab-buttons">
                    <button
                        className={tab === "info" ? "tab-primary" : "tab-secondary"}
                        onClick={() => setActiveTab("info")}
                    >
                        Group Info
                    </button>

                    <button
                        className={tab === "members" ? "tab-primary" : "tab-secondary"}
                        onClick={() => setActiveTab("members")}
                    >
                        Members
                    </button>

                    <button
                        className={tab === "services" ? "tab-primary" : "tab-secondary"}
                        onClick={() => setActiveTab("services")}
                    >
                        Group Services
                    </button>
                </div>
            </div>

            {tab === "members" && (
                <section className="service-section">
                    <DataTable
                        columns={membersCols}
                        data={group?.members ?? []}
                        isLoading={pendingGroup}
                        onRefresh={refetch}
                        enableFilter={false}
                        enableSort={false}
                        tableActionsLeft={
                            <button
                                className="btn-primary"
                                onClick={() => setOpenMembersModal(true)}
                            >
                                Add Members
                            </button>
                        }
                    />
                </section>
            )}

            {tab === "services" && (
                <section className="service-section">
                    <DataTable
                        columns={servicesCols}
                        data={servicesData?.services ?? []}
                        isLoading={pendingServices}
                        onRefresh={refetch}
                        enableFilter={false}
                        enableSort={false}
                        tableActionsLeft={
                            <button
                                className="btn-primary mt-2"
                                onClick={() => setServicesModal(true)}
                            >
                                Add Service
                            </button>
                        }
                    />
                </section>
            )}

            {tab === "info" && (
                <section className="service-section">
                    <h2>Group Overview</h2>

                    <div className="profile-section">
                        <h3>Details</h3>
                        <button
                            onClick={handleToggle}
                            disabled={isPending}
                            className={group.is_deleted ? "btn-pause" : "btn-unpause"}
                        >
                            {isPending ? "Processing..." : group.is_deleted ? "Group Inactive" : "Group Active"}
                        </button>

                        <div className="profile-grid">
                            <div>
                                <label>Group Name</label>
                                <p>{group?.contact_group_name}</p>
                            </div>

                            <div>
                                <label>Description</label>
                                <p>{group?.contact_group_description || "—"}</p>
                            </div>

                            <div>
                                <label>Primary Member</label>
                                <p>{group?.primary_member || "N/A"}</p>
                            </div>

                            <div>
                                <label>Status</label>
                                <p>
                                    {group?.is_deleted ? "Inactive" : "Active"}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <AddMembersModal
                isOpen={openMembersModal}
                onClose={() => setOpenMembersModal(false)}
                groupUuid={group?.uuid ?? ""}
                currentMembers={group?.members ?? []}
            />

            <AddServicesModal
                isOpen={openServicesModal}
                onClose={() => setServicesModal(false)}
                groupUuid={group?.uuid ?? ""}
                currentServices={servicesData?.services ?? []}
            />
        </>
    );
}
