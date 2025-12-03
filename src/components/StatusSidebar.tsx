import "@/css/StatusSidebar.css";

export default function StatusSidebar({ data, system }) {
  const uptimePercent =
    data && data.total_services > 0
      ? ((data.up_count / data.total_services) * 100).toFixed(3)
      : "0.000";


  function formatUptime(seconds: number) {
    const months = Math.floor(seconds / (30 * 24 * 3600));
    seconds %= 30 * 24 * 3600;
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= 24 * 3600;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const parts = [];
    if (months) parts.push(`${months}m`);
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (secs) parts.push(`${secs}s`);

    return parts.join(" ");
  }


  return (
    <div className="dashboard-status-sidebar">

      {/* CURRENT STATUS */}
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

          <div className="dashboard-status-item">
          <span className="dashboard-status-number gray">
            {formatUptime(system?.uptime_seconds ?? 0)}
          </span>
          <span className="dashboard-status-label">Uptime</span>
        </div>

        <p className="dashboard-status-subtext ">
          Using {data?.total_services ?? 0} of 50 monitors.
        </p>
      
      </div>

      {/* LAST 24 HOURS */}
      <div className="dashboard-status-card">
        <h3 className="dashboard-status-title">Last 24 Hours</h3>

        <div className="dashboard-status-grid">


          <div className="dashboard-status-item">
            <span className="dashboard-status-number gray">0</span>
            <span className="dashboard-status-label">Incidents</span>
          </div>

          <div className="dashboard-status-item">
            <span className="dashboard-status-number red-bold">{uptimePercent}%</span>
            <span className="dashboard-status-label">Overall Uptime</span>
          </div>

          <div className="dashboard-status-item">
            <span className="dashboard-status-number gray">1d</span>
            <span className="dashboard-status-label">No Incidents</span>
          </div>

          <div className="dashboard-status-item">
            <span className="dashboard-status-number gray">0</span>
            <span className="dashboard-status-label">Affected Monitors</span>
          </div>
        </div>
      </div>

      <div className="dashboard-status-card">
        <h3 className="dashboard-status-title">System Health</h3>

        <div className="dashboard-system-grid">
          <div className="dashboard-system-item">
            <span className="dashboard-status-label">App</span>
            <span className="dashboard-system-number gray">{system?.app}</span>
          </div>

          <div className="dashboard-system-item">
            <span className="dashboard-status-label">Version</span>
            <span className="dashboard-system-number gray">{system?.version}</span>
          </div>

          <div className="dashboard-system-item">
            <span className="dashboard-status-label">Environment</span>
            <span className="dashboard-system-number gray">{system?.environment}</span>
          </div>

          <div className="dashboard-system-item">
            <span className="dashboard-status-label">Database</span>
            <span
              className={`dashboard-system-number ${system?.database_status === "connected" ? "green" : "red"
                }`}
            >
              {system?.database_status}
            </span>
          </div>

          <div className="dashboard-system-item">
            <span className="dashboard-status-label">SSE Interval</span>
            <span className="dashboard-system-number gray">
              {system?.sse_push_interval_seconds}s
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
