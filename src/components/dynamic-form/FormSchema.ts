// ------ LOGIN FORM SCHEMA -----------
export const loginFormSchema: any = {
    id: "user-login",
    meta: {
        title: "Welcome Back",
        subtitle: "Sign in to continue"
    },

    fields: {
        email: {
            id: "email",
            label: "Email",
            renderer: "text",
            inputType: "email",
            placeholder: "you@example.com",
            rules: {
                required: "Email is required",
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email"
                }
            }
        },

        password: {
            id: "password",
            label: "Password",
            renderer: "text",
            inputType: "password",
            placeholder: "••••••••",
            rules: {
                required: "Password is required"
            }
        },

        rememberMe: {
            id: "rememberMe",
            label: "Remember me",
            renderer: "checkbox",
            defaultValue: false
        }
    },

    layout: [
        {
            kind: "section",
            title: "Login",
            withDivider: true,
            children: [
                {
                    kind: "stack",
                    spacing: "md",
                    children: [
                        { kind: "field", fieldId: "email" },
                        { kind: "field", fieldId: "password" },
                        { kind: "field", fieldId: "rememberMe" }
                    ]
                }
            ]
        }
    ]
};




// ------SYSTEM SETTINGS FORM SCHEMA------
export const systemSettingsFormSchema: any = {
  id: "system-settings-form",
  meta: {
    title: "System Settings",
    subtitle: "Configure System defaults"
  },
  fields: {
    //  UPTIME 
    uptime_check_interval: {
      id: "uptime_check_interval",
      label: "Uptime Check Interval (seconds)",
      renderer: "number",
      props: { min: 1 },
      placeholders: 60,
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
      placeholders: 3,
      rules: { required: "Retry count is required" }
    },
    uptime_retry_delay: {
      id: "uptime_retry_delay",
      label: "Uptime Retry Delay (seconds)",
      renderer: "number",
      props: { min: 1 },
      placeholders: 10,
      rules: { required: "Retry delay is required" }
    },
    sse_push_interval: {
      id: "sse_push_interval",
      label: "SSE Push Interval (seconds)",
      renderer: "number",
      props: { min: 1 },
      placeholders: 5,
      rules: { required: "SSE push interval is required" }
    },

    //  SSL 
    ssl_check_interval: {
      id: "ssl_check_interval",
      label: "SSL Check Interval (seconds)",
      renderer: "number",
      props: { min: 1 },
      placeholders: 3600,
      rules: { required: "SSL check interval is required" }
    },
    ssl_alert_thresholds: {
      id: "ssl_alert_thresholds",
      label: "SSL Alert Thresholds (days)",
      renderer: "text",
      placeholders: "30,14,7",
      rules: { required: "SSL alert thresholds are required" }
    },
    ssl_retry_count: {
      id: "ssl_retry_count",
      label: "SSL Retry Count",
      renderer: "number",
      props: { min: 0 },
      placeholders: 3,
      rules: { required: "SSL retry count is required" }
    },
    ssl_retry_delay: {
      id: "ssl_retry_delay",
      label: "SSL Retry Delay (seconds)",
      renderer: "number",
      props: { min: 1 },
      placeholders: 300,
      rules: { required: "SSL retry delay is required" }
    },

    //  NOTIFICATIONS 
    notification_check_interval: {
      id: "notification_check_interval",
      label: "Notification Check Interval (seconds)",
      renderer: "number",
      props: { min: 1 },
      placeholders: 120,
      rules: { required: "Notification check interval is required" }
    },
    notification_retry_count: {
      id: "notification_retry_count",
      label: "Notification Retry Count",
      renderer: "number",
      props: { min: 0 },
      placeholders: 5,
      rules: { required: "Notification retry count is required" }
    },
    notification_cooldown_minutes: {
      id: "notification_cooldown_minutes",
      label: "Notification Cooldown (minutes)",
      renderer: "number",
      props: { min: 0 },
      placeholders: 15,
      rules: { required: "Notification cooldown is required" }
    }
  },

  layout: [
    // Uptime Section
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

    // SSL Section
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

    // Notification Section
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


export  const createGroupSchema: any = {
    id: "create-contact-group",
    meta: {
      title: "Create Contact Group",
      subtitle: "Enter new group details",
    },
    fields: {
      contact_group_name: { id: "contact_group_name", label: "Group Name", renderer: "text" },
      contact_group_description: { id: "contact_group_description", label: "Description", renderer: "textarea" },
    },
    layout: [{ kind: "stack", spacing: "md", children: [{ kind: "field", fieldId: "contact_group_name" }, { kind: "field", fieldId: "contact_group_description" }] }],
  };



// ------MONITORED SERVICE FORM SCHEMA------
export const monitoredServiceFormSchema: any = {
    id: "monitored-service-form",
    meta: {
        title: "Create Monitored Service",
        subtitle: "Provide the details of the service you want to monitor"
    },

    fields: {
        monitored_service_name: {
            id: "monitored_service_name",
            label: "Service Name",
            renderer: "text",
            placeholder: "Enter service name",
            rules: {
                required: "Service name is required",
                minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters"
                }
            }
        },

        monitored_service_url: {
            id: "monitored_service_url",
            label: "Service URL",
            renderer: "text",
            placeholder: "https://example.com",
            rules: {
                required: "URL is required",
                pattern: {
                    value: /^https?:\/\/.+/,
                    message: "Must start with http:// or https://"
                }
            }
        },

        monitored_service_region: {
            id: "monitored_service_region",
            label: "Region",
            renderer: "select",
            placeholder: "Select region",
            props: {
                data: [
                    { label: "US-East", value: "us-east" },
                    { label: "US-West", value: "us-west" },
                    { label: "EU", value: "eu" },
                    { label: "APAC", value: "apac" },
                    { label: "default", value: "default" }
                ]
            }
        },

        check_interval: {
            id: "check_interval",
            label: "Check Interval (seconds)",
            renderer: "number",
            placeholder: "60",
            props: {
                min: 5,
                max: 86400
            },
           
        },

        is_active: {
            id: "is_active",
            label: "Active",
            renderer: "switch",
            defaultValue: true
        },

        retry_count: {
            id: "retry_count",
            label: "Retry Count",
            renderer: "number",
            placeholder: "3",
            props: { min: 0, max: 10 },
        },

        retry_delay: {
            id: "retry_delay",
            label: "Retry Delay (seconds)",
            renderer: "number",
            placeholder: "10",
            props: { min: 0, max: 300 },
        },

        expected_status_code: {
            id: "expected_status_code",
            label: "Expected Status Code",
            renderer: "number",
            placeholder: "200",
            props: { min: 100, max: 599 },
        },

        ssl_enabled: {
            id: "ssl_enabled",
            label: "SSL Enabled",
            renderer: "switch",
            defaultValue: true
        }
    },

    layout: [
        {
            kind: "section",
            title: "Basic Information",
            withDivider: true,
            children: [
                {
                    kind: "grid",
                    cols: 2,
                    spacing: "md",
                    children: [
                        { kind: "field", fieldId: "monitored_service_name" },
                        { kind: "field", fieldId: "monitored_service_url" }
                    ]
                },
                {
                    kind: "grid",
                    cols: 2,
                    spacing: "md",
                    children: [
                        { kind: "field", fieldId: "monitored_service_region" },
                        { kind: "field", fieldId: "check_interval" }
                    ]
                },
                {
                    kind: "grid",
                    cols: 1,
                    spacing: "md",
                    children: [
                        { kind: "field", fieldId: "is_active" }
                    ]
                }
            ]
        },

        {
            kind: "section",
            title: "Retry & Status Settings",
            withDivider: true,
            children: [
                {
                    kind: "grid",
                    cols: 3,
                    spacing: "md",
                    children: [
                        { kind: "field", fieldId: "retry_count" },
                        { kind: "field", fieldId: "retry_delay" },
                        { kind: "field", fieldId: "expected_status_code" }
                    ]
                },
                {
                    kind: "field",
                    fieldId: "ssl_enabled"
                }
            ]
        }
    ]
};




//--------- ADD MEMBERS
export const addMembersSchema: any = {
  id: "add-members",
  meta: {
    title: "Add Members",
    subtitle: "Select users to add to this contact group"
  },

  fields: {
    members: {
      id: "members",
      label: "Select Members",
      renderer: "multiselect",
      props: {
        dataSource: "users",      
        labelKey: (u: any) => `${u.first_name} ${u.last_name}`,
        valueKey: "id",
        searchable: true,
        maxValues: 100,
        minValues: 1,
      },
      rules: {
        required: "Select at least one user",
        validate: (value: number[]) =>
          value?.length > 0 || "You must select at least one member"
      }
    }
  },

  layout: [
    {
      kind: "section",
      title: "Available Users",
      withDivider: true,
      children: [
        {
          kind: "stack",
          spacing: "md",
          children: [
            { kind: "field", fieldId: "members" }
          ]
        }
      ]
    }
  ]
};





// =----------------- CREATE NEW USER -------------------
export const createUserSchema: any = {
  id: "create-user-form",
  meta: {
    // title: "Create New User",
    subtitle: "Add a new user to the system",
  },
  fields: {
    first_name: {
      id: "first_name",
      label: "First Name",
      renderer: "text",
      rules: { required: "First name is required" },
    },
    last_name: {
      id: "last_name",
      label: "Last Name",
      renderer: "text",
      rules: { required: "Last name is required" },
    },
    user_email: {
      id: "user_email",
      label: "Email",
      renderer: "text",
      inputType: "email",
      rules: {
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email",
        },
      },
    },
    role_name: {
      id: "role_name",
      label: "Role",
      renderer: "select",
      props: {
        data: [
          { label: "Viewer", value: "VIEWER" },
          { label: "Operator", value: "OPERATOR" },
          { label: "Admin", value: "ADMIN" }
        ],
      },
      rules: { required: "Role is required" },
    },
    company_id: {
      id: "company_id",
      label: "Company",
      renderer: "select",
      props: {
        data: [], // will be populated from API
        searchable: true,
      },
      rules: { required: "Company is required" },
    },
  },
  layout: [
    {
      kind: "section",
      title: "User Information",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "first_name" },
            { kind: "field", fieldId: "last_name" },
            { kind: "field", fieldId: "user_email", colSpan: 2 },
            { kind: "field", fieldId: "role_name" },
            { kind: "field", fieldId: "company_id" },
          ],
        },
      ],
    },
  ],
};



export const updateServiceSchema: any = {
  id: "update-monitored-service",
  meta: {
    title: "Update Monitored Service",
    subtitle: "Modify details for the selected service"
  },
  fields: {
    monitored_service_name: {
      id: "monitored_service_name",
      label: "Service Name",
      renderer: "text",
      rules: { required: "Service Name is required" }
    },
    monitored_service_url: {
      id: "monitored_service_url",
      label: "Service URL",
      renderer: "text",
      inputType: "url",
      rules: {
        required: "Service URL is required",
        pattern: {
          value: /^https?:\/\/.+/,
          message: "Must be a valid URL"
        }
      }
    },
    monitored_service_region: {
      id: "monitored_service_region",
      label: "Region",
      renderer: "text"
    },
    check_interval: {
      id: "check_interval",
      label: "Check Interval (seconds)",
      renderer: "number",
      props: { min: 1 }
    },
    retry_count: {
      id: "retry_count",
      label: "Retry Count",
      renderer: "number",
      props: { min: 0 }
    },
    retry_delay: {
      id: "retry_delay",
      label: "Retry Delay (seconds)",
      renderer: "number",
      props: { min: 0 }
    },
    expected_status_code: {
      id: "expected_status_code",
      label: "Expected Status Code",
      renderer: "number",
      props: { min: 100, max: 599 }
    },
    ssl_enabled: {
      id: "ssl_enabled",
      label: "SSL Enabled",
      renderer: "switch",
      defaultValue: true
    }
  },
  layout: [
    {
      kind: "section",
      title: "Service Details",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "monitored_service_name" },
            { kind: "field", fieldId: "monitored_service_url" },
            { kind: "field", fieldId: "monitored_service_region" },
            { kind: "field", fieldId: "ssl_enabled" }
          ]
        }
      ]
    },
    {
      kind: "section",
      title: "Monitoring Configuration",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 3,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "check_interval" },
            { kind: "field", fieldId: "retry_count" },
            { kind: "field", fieldId: "retry_delay" },
            { kind: "field", fieldId: "expected_status_code" }
          ]
        }
      ]
    }
  ]
};








// USER PROFILE
export const userProfileSchema: any = {
  id: "user-profile",
  meta: {
    // title: "User Profile",
    subtitle: "Manage your personal information and preferences",
  },

  fields: {
    first_name: {
      id: "first_name",
      label: "First Name",
      renderer: "text",
      rules: { required: "Required" },
    },

    last_name: {
      id: "last_name",
      label: "Last Name",
      renderer: "text",
      rules: { required: "Required" },
    },

    email: {
      id: "email",
      label: "Primary Email",
      renderer: "text",
      inputType: "email",
      disabled: true, 
    },

    // CONTACTS
    contact_email: {
      id: "contact_email",
      label: "Primary Contact Email",
      renderer: "text",
      inputType: "email",
      rules: { required: "Required" },
    },

    // PREFERENCES
    alert_channel: {
      id: "alert_channel",
      label: "Alert Channel",
      renderer: "select",
      props: {
        data: [
          { label: "Email", value: "EMAIL" },
          { label: "Telegram", value: "TELEGRAM" },
          { label: "SMS", value: "SMS" }
        ],
      },
      rules: { required: "Required" },
    },

    receive_weekly_reports: {
      id: "receive_weekly_reports",
      label: "Receive Weekly Reports",
      renderer: "switch",
      defaultValue: true,
    },

    language: {
      id: "language",
      label: "Language",
      renderer: "select",
      disabled: true,
      props: {
        data: [
          { label: "English", value: "en" },
          { label: "French", value: "fr" },
          { label: "Swahili", value: "sw" },
        ],
      },
      rules: { required: "Required" },
    },

    timezone: {
      id: "timezone",
      label: "Timezone",
      renderer: "select",
      disabled: true,
      props: {
        data: [
          { label: "UTC", value: "UTC" },
          { label: "Africa/Nairobi", value: "Africa/Nairobi" },
          { label: "Europe/London", value: "Europe/London" },
        ],
      },
      rules: { required: "Required" },
    },
  },
  layout: [
    {
      kind: "section",
      title: "Personal Information",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "first_name" },
            { kind: "field", fieldId: "last_name" },
            { kind: "field", fieldId: "email", colSpan: 2 },
          ],
        },
      ],
    },

    {
      kind: "section",
      title: "Contact Information",
      withDivider: true,
      children: [
        {
          kind: "stack",
          spacing: "md",
          children: [{ kind: "field", fieldId: "contact_email" }],
        },
      ],
    },

    {
      kind: "section",
      title: "Preferences",
      withDivider: false,
      children: [
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "alert_channel" },
            { kind: "field", fieldId: "receive_weekly_reports", colSpan: 2 },
            { kind: "field", fieldId: "language" },
            { kind: "field", fieldId: "timezone" },
          ],
        },
      ],
    },
  ],
};
