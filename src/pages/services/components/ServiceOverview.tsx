import { DataTable } from "@/components/table/DataTable";
import type { ServiceOverviewData } from "@/pages/services/data-access/types";

type Props = {
    overview: ServiceOverviewData;
};

export default function ServiceOverview({ overview }: Props) {
    // --- Columns for member table ---
    const memberColumns = [
        { id: "group_name", caption: "Group", size: 200 },
        { id: "first_name", caption: "First Name", size: 150 },
        { id: "last_name", caption: "Last Name", size: 150 },
        { id: "email", caption: "Email", size: 250 },
    ];

    // --- Flatten members from all contact groups ---
    const memberData = overview.contact_groups.flatMap((group) =>
        (group.members || []).map((member) => ({
            ...member,
            group_name: group.name,
        }))
    );

    return (
        <>


        <section className="service-section">

            <div className="service-grid">
                <div>
                    <strong>URL:</strong>{" "}
                    <a href={overview.url} target="_blank" rel="noopener noreferrer">
                        {overview.url}
                    </a>
                </div>
                <div><strong>Status:</strong> {overview.last_uptime_status}</div>
                <div><strong>Interval:</strong> {overview.check_interval}s</div>
                <div><strong>Retry:</strong> {overview.retry_count}</div>
                <div><strong>Region:</strong> {overview.region || "N/A"}</div>
                <div><strong>SSL Enabled:</strong> {overview.ssl_enabled ? "Yes" : "No"}</div>
                <div><strong>Consecutive Failures:</strong> {overview.consecutive_failures}</div>
            </div>




        </section>

            {/* --- Contact Groups --- */}
            <section className="service-section">
                <h3>Contact Groups</h3>
                {overview.contact_groups.length === 0 ? (
                    <p>No contact groups assigned.</p>
                ) : (
                    <div className="group-list">
                        {overview.contact_groups.map((group) => (
                            <div key={group.uuid} className="group-card">
                                <h4>{group.name}</h4>
                                <p>{group.description || "—"}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <div className="service-section">
                    <h3>Group Members</h3>
                    {memberData.length === 0 ? (
                        <p>No members in any group.</p>
                    ) : (
                        <DataTable
                            columns={memberColumns}
                            data={memberData}
                            isLoading={false}
                            enableFilter={true}
                            enableSort={true}
                            enableRefresh={false}
                        />
                    )}
                </div>
            </section>
        </>
    );
}
