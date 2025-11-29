import Loader from "@/components/Loader";

interface StatusSidebarProps {
  data: any;
  systemHealth: any;
}

// Helper: format uptime seconds to d/h/m
function formatUptime(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);

  return parts.join(" ");
}

export default function StatusSidebar({ data, systemHealth }: StatusSidebarProps) {
  const uptimePercent =
    data && data.total_services > 0
      ? ((data.up_count / data.total_services) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="status-sidebar">
      {/* Current Status Card */}
      <div className="status-card">
        <h3 className="status-title">Current status.</h3>

        <div className="status-icon-wrapper">
          <Loader showText={false} className="status-icon" />
        </div>
        <div className="status-group">
          {/* DOWN */}
          <div className="status-row" style={{ flexDirection: "column", textAlign: "center" }}>
            <span className="red">{data?.down_count ?? 0}</span>
            <span>Down</span>
          </div>

          {/* UP */}
          <div className="status-row" style={{ flexDirection: "column", textAlign: "center" }}>
            <span className="green">{data?.up_count ?? 0}</span>
            <span>Up</span>
          </div>

          {/* PAUSED */}
          <div className="status-row" style={{ flexDirection: "column", textAlign: "center" }}>
            <span className="gray">0</span>
            <span>Paused</span>
          </div>
        </div>
        {/* SSL WARNINGS */}
        
        <div className="status-row" style={{ flexDirection: "column", textAlign: "center" }}>
          <span className="orange">{data?.ssl_warnings ?? 0}</span>
          <span>SSL Warnings</span>
        </div>

        {/* SSL CRITICAL */}
        <div className="status-row" style={{ flexDirection: "column", textAlign: "center" }}>
          <span className="red">{data?.ssl_critical ?? 0}</span>
          <span>SSL Critical</span>
        </div>

        {/* SSL SEVERE */}
        <div className="status-row" style={{ flexDirection: "column", textAlign: "center" }}>
          <span className="darkred">{data?.ssl_severe ?? 0}</span>
          <span>SSL Severe</span>
        </div>

        <p className="status-subtext">
          Using {data?.total_services ?? 0} of 50 monitors.
        </p>
      </div>

      {/* Last 24h Card */}
      <div className="status-card">
        <h3 className="status-title">Last 24 hours.</h3>

        <div className="status-row" style={{ flexDirection: "column", textAlign: "center" }}>
          <span className="red-bold">{uptimePercent}%</span>
          <span>Overall uptime</span>
        </div>

        <div className="status-row" style={{ flexDirection: "column", textAlign: "center" }}>
          <span>0</span>
          <span>Incidents</span>
        </div>

        <div className="status-row" style={{ flexDirection: "column", textAlign: "center" }}>
          <span>1d</span>
          <span>Without incid.</span>
        </div>

        <div className="status-row" style={{ flexDirection: "column", textAlign: "center" }}>
          <span>0</span>
          <span>Affected mon.</span>
        </div>
      </div>



      {/* System Health Card */}
      <div className="status-card status-systemHealth">
        <h3 className="status-title">System Health</h3>

        <div className="status-row">
          <span>App:</span>
          <span>{systemHealth.app}</span>
        </div>
        <div className="status-row">
          <span>Version:</span>
          <span>{systemHealth?.version}</span>
        </div>
        <div className="status-row">
          <span>Environment:</span>
          <span>{systemHealth?.environment}</span>
        </div>
        <div className="status-row">
          <span>Uptime:</span>
          <span>{formatUptime(systemHealth?.uptime_seconds)}</span>
        </div>
        <div className="status-row">
          <span>Database:</span>
          <span>{systemHealth.database}</span>
        </div>
        <div className="status-row">
          <span>DB Status:</span>
          <span
            className={systemHealth.database_status === "connected" ? "green" : "red"}
          >
            {systemHealth.database_status}
          </span>
        </div>
        <div className="status-row">
          <span>SSE Interval:</span>
          <span>{systemHealth.sse_push_interval_seconds}s</span>
        </div>
        <div className="status-row">
          <span>Last Updated:</span>
          <span>{new Date(systemHealth.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
