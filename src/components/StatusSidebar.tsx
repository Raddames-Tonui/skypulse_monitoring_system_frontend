import "@/css/StatusSidebar.css";

export default function StatusSidebar({ data }) {
  const uptimePercent =
    data && data.total_services > 0
      ? ((data.up_count / data.total_services) * 100).toFixed(3)
      : "0.000";

  return (
    <div className="dashboard-status-sidebar">
      <div className="dashboard-status-card">
        <h3 className="dashboard-status-title">Current Status</h3>

        <div className="dashboard-status-grid">
          <div className="dashboard-status-item">
            <span className="dashboard-status-number green">{data?.up_count ?? 0}</span>
            <span className="dashboard-status-label">Up</span>
          </div>

          <div className="dashboard-status-item">
            <span className="dashboard-status-number red">{data?.down_count ?? 0}</span>
            <span className="dashboard-status-label">Down</span>
          </div>

          <div className="dashboard-status-item">
            <span className="dashboard-status-number gray">0</span>
            <span className="dashboard-status-label">Paused</span>
          </div>
        </div>

        <p className="dashboard-status-subtext">
          Using {data?.total_services ?? 0} of 50 monitors.
        </p>
      </div>

      {/* Last 24 Hours Card */}
      <div className="dashboard-status-card">
        <h3 className="dashboard-status-title">Last 24 Hours</h3>

        <div className="dashboard-status-grid">
          <div className="dashboard-status-item">
            <span className="dashboard-status-number red-bold">{uptimePercent}%</span>
            <span className="dashboard-status-label">Overall Uptime</span>
          </div>

          <div className="dashboard-status-item">
            <span className="dashboard-status-number gray">0</span>
            <span className="dashboard-status-label">Incidents</span>
          </div>

          <div className="dashboard-status-item">
            <span className="dashboard-status-number gray">1d</span>
            <span className="dashboard-status-label">Without Incidents</span>
          </div>

          <div className="dashboard-status-item">
            <span className="dashboard-status-number gray">0</span>
            <span className="dashboard-status-label">Affected Monitors</span>
          </div>
        </div>
      </div>
    </div>
  );
}
