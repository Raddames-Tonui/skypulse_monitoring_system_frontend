

export const systemSettingsFormSchema: any = {
  id: "system-settings-form",
  meta: {
    title: "System Settings",
    subtitle: "Configure default values for monitored services"
  },
  fields: {
    key: {
      id: "key",
      label: "Setting Key",
      renderer: "text",
      placeholder: "Enter unique setting key",
      rules: { required: "Key is required" }
    },
    value: {
      id: "value",
      label: "Value",
      renderer: "text",
      placeholder: "Default value",
      rules: { required: "Value is required" }
    },
    description: {
      id: "description",
      label: "Description",
      renderer: "textarea",
      placeholder: "Description of the setting",
      props: { minRows: 3, maxRows: 6 },
      rules: { required: "Description is required" }
    },
    uptime_check_interval: {
      id: "uptime_check_interval",
      label: "Uptime Check Interval (minutes)",
      renderer: "number",
      props: { min: 1 },
      rules: { required: "Interval is required", min: { value: 1, message: "Must be >= 1" } }
    },
    uptime_retry_count: {
      id: "uptime_retry_count",
      label: "Uptime Retry Count",
      renderer: "number",
      props: { min: 0 },
      rules: { required: "Retry count is required" }
    },
    uptime_retry_delay: {
      id: "uptime_retry_delay",
      label: "Uptime Retry Delay (minutes)",
      renderer: "number",
      props: { min: 1 },
      rules: { required: "Retry delay is required" }
    },
    ssl_check_interval: {
      id: "ssl_check_interval",
      label: "SSL Check Interval (days)",
      renderer: "number",
      props: { min: 1 },
      rules: { required: "SSL check interval is required" }
    },
    ssl_alert_thresholds: {
      id: "ssl_alert_thresholds",
      label: "SSL Alert Thresholds (days)",
      renderer: "text",
      placeholder: "e.g. 30,15,7",
      rules: { required: "SSL alert thresholds are required" }
    },
    notification_retry_count: {
      id: "notification_retry_count",
      label: "Notification Retry Count",
      renderer: "number",
      props: { min: 0 },
      rules: { required: "Notification retry count is required" }
    }
  },
  layout: [
    {
      kind: "section",
      title: "Service Defaults",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "key" },
            { kind: "field", fieldId: "value" },
            { kind: "field", fieldId: "description", colSpan: 2 },
            { kind: "field", fieldId: "uptime_check_interval" },
            { kind: "field", fieldId: "uptime_retry_count" },
            { kind: "field", fieldId: "uptime_retry_delay" },
            { kind: "field", fieldId: "ssl_check_interval" },
            { kind: "field", fieldId: "ssl_alert_thresholds" },
            { kind: "field", fieldId: "notification_retry_count" }
          ]
        }
      ]
    }
  ]
};
