import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { DataTable } from "@/components/table/DataTable";
import type { ServiceOverviewData, ContactGroupOverview } from "@/pages/services/data-access/types";
import UpdateServiceModal from "@/pages/services/components/UpdateServiceModal.tsx";
import "@/css/overview.css"

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

                {/* HEADER */}
                <div className="bc-card-header">
                    <div className="bc-card-title">{overview.name}
                        <a href={overview.url} target="_blank" rel="noopener noreferrer">{overview.url}</a>
                    </div>
                    <div className="bc-card-actions">
                        <button className="btn-primary" onClick={() => setEditModalOpen(true)}>
                            Edit Service
                        </button>
                    </div>
                </div>

                {/* BASIC INFO */}
                <div className="bc-section">
                    <div className="bc-section-title">Basic Information</div>
                    <div className="bc-fields">


                        <div>
                            <div className="bc-field-label">URL</div>
                            <div className="bc-field-value">
                                <a href={overview.url} target="_blank" rel="noopener noreferrer" className="bc-url-icon">↗</a>
                            </div>
                        </div>

                        <div>
                            <div className="bc-field-label">Region</div>
                            <div className="bc-field-value">{overview.region || "—"}</div>
                        </div>

                        <div>
                            <div className="bc-field-label">Status</div>
                            <div className="bc-field-value">{overview.last_uptime_status}</div>
                        </div>

                        <div>
                            <div className="bc-field-label">Interval</div>
                            <div className="bc-field-value">{overview.check_interval ?? "—"} sec</div>
                        </div>
                    </div>
                </div>

                <div className="bc-section">
                    <div className="bc-section-title">Uptime And SSL Checks</div>
                    <div className="bc-fields">
                        <div>
                            <div className="bc-field-label">Retry Count</div>
                            <div className="bc-field-value">{overview.retry_count ?? "—"}</div>
                        </div>

                        <div>
                            <div className="bc-field-label">Retry Delay</div>
                            <div className="bc-field-value">{overview.retry_delay ?? "—"} sec</div>
                        </div>

                        <div>
                            <div className="bc-field-label">Expected Status Code</div>
                            <div className="bc-field-value">{overview.expected_status_code ?? "—"}</div>
                        </div>

                        <div>
                            <div className="bc-field-label">SSL</div>
                            <div className="bc-field-value">{overview.ssl_enabled ? "Enabled" : "Disabled"}</div>
                        </div>
                    </div>
                </div>

                {/* META */}
                <div className="bc-section">
                    <div className="bc-section-title">Meta</div>
                    <div className="bc-fields">
                        <div>
                            <div className="bc-field-label">Consecutive Failures</div>
                            <div className="bc-field-value">{overview.consecutive_failures}</div>
                        </div>

                        <div>
                            <div className="bc-field-label">Created By</div>
                            <div className="bc-field-value">
                                {typeof overview.created_by === "object"
                                    ? `${overview.created_by.first_name} ${overview.created_by.last_name}`
                                    : "—"}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="service-section">
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
