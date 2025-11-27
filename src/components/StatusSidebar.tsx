import "@/css/StatusSidebar.module.css"
export default function StatusSidebar({ data }) {
  const uptimePercent =
    data && data.total_services > 0
      ? ((data.up_count / data.total_services) * 100).toFixed(3)
      : "0.000";

  return (
    <div className="status-sidebar">
      <div className="status-card">
        <h3 className="status-title">Current status.</h3>

        <div className="status-icon-wrapper">
          <div className="status-icon"></div>
        </div>

        <div className="status-row">
          <span>Down</span>
          <span className="red">{data?.down_count ?? 0}</span>
        </div>

        <div className="status-row">
          <span>Up</span>
          <span className="green">{data?.up_count ?? 0}</span>
        </div>

        <div className="status-row">
          <span>Paused</span>
          <span className="gray">0</span>
        </div>

        <p className="status-subtext">
          Using {data?.total_services ?? 0} of 50 monitors.
        </p>
      </div>

      <div className="status-card">
        <h3 className="status-title">Last 24 hours.</h3>

        <div className="status-row">
          <span className="red-bold">{uptimePercent}%</span>
          <span>Overall uptime</span>
        </div>

        <div className="status-row">
          <span>0</span>
          <span>Incidents</span>
        </div>

        <div className="status-row">
          <span>1d</span>
          <span>Without incid.</span>
        </div>

        <div className="status-row">
          <span>0</span>
          <span>Affected mon.</span>
        </div>
      </div>
    </div>
  );
}
