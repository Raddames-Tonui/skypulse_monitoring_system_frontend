import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { DataTable } from "@/components/table/DataTable";
import type { ServiceOverviewData, ContactGroupOverview } from "@/pages/services/data-access/types";
import UpdateServiceModal from "@/pages/services/components/UpdateServiceModal.tsx";

type Props = {
    overview: ServiceOverviewData;
};

const getContactGroupColumns = (navigate: ReturnType<typeof useNavigate>) => [
    { id: "uuid", caption: "UUID", hide: true },
    { id: "name", caption: "Group Name", isSortable: true },
    { id: "description", caption: "Description" },
    {
        id: "actions",
        caption: "Actions",
        renderCell: (_: any, row: ContactGroupOverview) => (
            <button
                className="action-btn"
                onClick={() => navigate({ to: "/groups/$uuid", params: { uuid: row.uuid } })}
            >
                View
            </button>
        ),
    },
];

export default function ServiceOverview({ overview }: Props) {
    const navigate = useNavigate();
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    return (
        <>
            <section className="service-section">
                <div className="service-grid">
                    <div><strong>Name:</strong> {overview.name}</div>
                    <div>
                        <strong>URL:</strong>{" "}
                        <a href={overview.url} target="_blank" rel="noopener noreferrer">
                            {overview.url}
                        </a>
                    </div>
                    <div><strong>Status:</strong> {overview.last_uptime_status}</div>
                    <div><strong>Interval:</strong> {overview.check_interval ?? "-"} sec</div>
                    <div><strong>Retry Count:</strong> {overview.retry_count ?? "-"}</div>
                    <div><strong>Retry Delay:</strong> {overview.retry_delay ?? "-"} sec</div>
                    <div><strong>Region:</strong> {overview.region || "-"}</div>
                    <div><strong>Region:</strong> {overview.expected_status_code || "-"}</div>
                    <div><strong>SSL Enabled:</strong> {overview.ssl_enabled ? "Yes" : "No"}</div>
                    <div><strong>Consecutive Failures:</strong> {overview.consecutive_failures}</div>
                    <div><strong>Created By:</strong> {typeof overview.created_by === "object" ? `${overview.created_by.first_name} ${overview.created_by.last_name}` : "N/A"}</div>
                </div>

                <button className="action-btn mt-4" onClick={() => setEditModalOpen(true)}>
                    Edit Service
                </button>
            </section>

            <section className="service-section mt-6">
                <h3>Contact Groups</h3>
                {overview.contact_groups.length === 0 ? (
                    <p>No contact groups assigned.</p>
                ) : (
                    <DataTable
                        columns={getContactGroupColumns(navigate)}
                        data={overview.contact_groups}
                        enableFilter={false}
                        enableSort={false}
                        enableRefresh={false}
                        isLoading={false}
                    />
                )}
            </section>

            <UpdateServiceModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                initialData={{
                    uuid: overview.uuid,
                    name: overview.name,
                    url: overview.url,
                    region: overview.region,
                    check_interval: overview.check_interval,
                    is_active: overview.is_active,
                    retry_count: overview.retry_count,
                    retry_delay: overview.retry_delay,
                    expected_status_code: overview.expected_status_code,
                    ssl_enabled: overview.ssl_enabled,
                }}
            />
        </>
    );
}
