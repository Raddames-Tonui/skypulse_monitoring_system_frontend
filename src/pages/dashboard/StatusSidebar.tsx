import "@css/StatusSidebar.css";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default function StatusSidebar({ data, system }) {
  const total = data?.total_services ?? 0;
  const up = data?.up_count ?? 0;
  const down = data?.down_count ?? 0;
  const paused = data?.paused_count ?? 0;

  const incidents24h = data?.incidents_last_24h ?? 0;
  const affectedMonitors = data?.affected_monitors_24h ?? 0;

  const sslAttention = data?.ssl_attention_required ?? 0;

  const uptimePercent = total > 0 ? ((up / total) * 100).toFixed(0) : "0";

  function formatUptime(seconds: number) {
    let remaining = seconds;
    const days = Math.floor(remaining / 86400);
    remaining %= 86400;
    const hours = Math.floor(remaining / 3600);
    remaining %= 3600;
    const minutes = Math.floor(remaining / 60);
    const secs = remaining % 60;

    const parts = [];
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
              <span className="dashboard-status-number green">{up}</span>
              <span className="dashboard-status-label">Up</span>
            </div>

            <div className="dashboard-status-item">
              <span className="dashboard-status-number red">{down}</span>
              <span className="dashboard-status-label">Down</span>
            </div>

            <div className="dashboard-status-item">
              <span className="dashboard-status-number gray">{paused}</span>
              <span className="dashboard-status-label">Paused</span>
            </div>
          </div>

          <div className="dashboard-status-item">
          <span className="dashboard-status-number gray">
            {formatUptime(system?.uptime_seconds ?? 0)}
          </span>
            <span className="dashboard-status-label">Uptime</span>
          </div>

          <p className="dashboard-status-subtext">
            Monitoring {total} Services
          </p>
        </div>

        {/* LAST 24 HOURS */}
        <div className="dashboard-status-card">
          <h3 className="dashboard-status-title">Last 24 Hours</h3>

          <div className="dashboard-status-grid">
            <div className="dashboard-status-item">
              <span className="dashboard-status-number gray">{incidents24h}</span>
              <span className="dashboard-status-label">Incidents</span>
            </div>

            <div className="dashboard-status-item">
              <span className="dashboard-status-number red-bold">{uptimePercent}%</span>
              <span className="dashboard-status-label">Overall Uptime</span>
            </div>

            <div className="dashboard-status-item">
            <span className="dashboard-status-number gray">
              {sslAttention === 0 ? "OK" : sslAttention}
            </span>
              <span className="dashboard-status-label">SSL Alerts</span>
            </div>

            <div className="dashboard-status-item">
              <span className="dashboard-status-number gray">{affectedMonitors}</span>
              <span className="dashboard-status-label">Affected Monitors</span>
            </div>
          </div>
        </div>

        {/* SYSTEM HEALTH */}
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
                  className={`dashboard-system-number ${
                      system?.database_status === "connected" ? "green" : "red"
                  }`}
              >
              {system?.database_status}
            </span>
            </div>

            <div className="dashboard-system-item">
              <span className="dashboard-status-label">Network</span>
              <span
                  className={`dashboard-system-number ${
                      system?.network_status === "Network Available" ? "green" : "red"
                  }`}
              >
              {system?.network_status}
            </span>
            </div>

            <div className="dashboard-system-item">
              <span className="dashboard-status-label">SSE Interval</span>
              <span className="dashboard-system-number gray">
              {system?.sse_push_interval_seconds} sec
            </span>
            </div>
          </div>
        </div>

      </div>
  );
}
