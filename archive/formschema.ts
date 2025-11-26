
// ------SYSTEM SETTINGS FORM SCHEMA------
export const systemSettingsFormSchema: any = {
  id: "system-settings-form",
  meta: {
    title: "System Settings",
    subtitle: "Configure default values for monitored services"
  },
  fields: {
    // Uptime
    uptime_check_interval: {
      id: "uptime_check_interval",
      label: "Uptime Check Interval (seconds)",
      renderer: "number",
      props: { min: 1 },
      placeholder: 6,
      rules: {
        required: "Interval is required",
        min: { value: 1, message: "Must be >= 1" }
      }
    },
    uptime_retry_count: {
      id: "uptime_retry_count",
      label: "Uptime Retry Count",
      renderer: "number",
      props: { min: 0 },
      placeholder: 3,
      rules: { required: "Retry count is required" }
    },
    uptime_retry_delay: {
      id: "uptime_retry_delay",
      label: "Uptime Retry Delay (seconds)",
      renderer: "number",
      props: { min: 1 },
      placeholder: 5,
      rules: { required: "Retry delay is required" }
    },
    sse_push_interval: {
      id: "sse_push_interval",
      label: "SSE Push Interval (seconds)",
      renderer: "number",
      props: { min: 1 },
      placeholder: 6,
      rules: { required: "SSE push interval is required" }
    },

    // SSL
    ssl_check_interval: {
      id: "ssl_check_interval",
      label: "SSL Check Interval (seconds)",
      renderer: "number",
      props: { min: 1 },
      placeholder: 6,
      rules: { required: "SSL check interval is required" }
    },
    ssl_alert_thresholds: {
      id: "ssl_alert_thresholds",
      label: "SSL Alert Thresholds (days)",
      renderer: "text",
      placeholder: "e.g. 30,14,7,3",
      defaultValue: "30,15,7,3",
      rules: { required: "SSL alert thresholds are required" }
    },
    ssl_retry_count: {
      id: "ssl_retry_count",
      label: "SSL Retry Count",
      renderer: "number",
      props: { min: 0 },
      placeholder: 3,
      rules: { required: "SSL retry count is required" }
    },
    ssl_retry_delay: {
      id: "ssl_retry_delay",
      label: "SSL Retry Delay (seconds)",
      renderer: "number",
      props: { min: 1 },
      placeholder: 5,
      rules: { required: "SSL retry delay is required" }
    },

    // Notification
    notification_check_interval: {
      id: "notification_check_interval",
      label: "Notification Check Interval (seconds)",
      renderer: "number",
      props: { min: 1 },
      placeholder: 6,
      rules: { required: "Notification check interval is required" }
    },
    notification_retry_count: {
      id: "notification_retry_count",
      label: "Notification Retry Count",
      renderer: "number",
      props: { min: 0 },
      placeholder: 3,
      rules: { required: "Notification retry count is required" }
    },
    notification_cooldown_minutes: {
      id: "notification_cooldown_minutes",
      label: "Notification Cooldown (minutes)",
      renderer: "number",
      props: { min: 0 },
      placeholder: 6,
      rules: { required: "Notification cooldown is required" }
    }
  },
  layout: [
    {
      kind: "section",
      title: "Uptime Settings",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "uptime_check_interval" },
            { kind: "field", fieldId: "uptime_retry_count" },
            { kind: "field", fieldId: "uptime_retry_delay" },
            { kind: "field", fieldId: "sse_push_interval" }
          ]
        }
      ]
    },
    {
      kind: "section",
      title: "SSL Settings",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "ssl_check_interval" },
            { kind: "field", fieldId: "ssl_alert_thresholds" },
            { kind: "field", fieldId: "ssl_retry_count" },
            { kind: "field", fieldId: "ssl_retry_delay" }
          ]
        }
      ]
    },
    {
      kind: "section",
      title: "Notification Settings",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "notification_check_interval" },
            { kind: "field", fieldId: "notification_retry_count" },
            { kind: "field", fieldId: "notification_cooldown_minutes" }
          ]
        }
      ]
    }
  ]
};
