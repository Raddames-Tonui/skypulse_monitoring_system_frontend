export const updateTemplateSchema: any = {
  id: "update-notification-template",
  meta: {
    title: "Update Notification Template",
    subtitle: "Modify template details and content",
  },
  fields: {
    subject_template: {
      id: "subject_template",
      label: "Subject Template",
      renderer: "text",
      placeholder: "Service {{service_name}} is down",
      rules: {
        required: "Subject template is required",
        minLength: {
          value: 3,
          message: "Subject must be at least 3 characters",
        },
      },
    },
    body_template: {
      id: "body_template",
      label: "Body Template",
      renderer: "textarea",
      placeholder: "Enter the email body template using {{variable}} syntax",
      props: {
        minRows: 8,
      },
      rules: {
        required: "Body template is required",
      },
    },
    pdf_template: {
      id: "pdf_template",
      label: "PDF Template (Optional)",
      renderer: "textarea",
      placeholder: "<html>...</html>",
      props: {
        minRows: 6,
      },
    },
    include_pdf: {
      id: "include_pdf",
      label: "Include PDF Attachment",
      renderer: "switch",
      defaultValue: false,
    },
    storage_mode: {
      id: "storage_mode",
      label: "Storage Mode",
      renderer: "select",
      props: {
        data: [
          { label: "Database", value: "DB" },
          { label: "File System", value: "FILE" },
          { label: "Hybrid (DB + File)", value: "HYBRID" },
        ],
      },
      rules: {
        required: "Storage mode is required",
      },
    },
    template_syntax: {
      id: "template_syntax",
      label: "Template Syntax",
      renderer: "select",
      props: {
        data: [
          { label: "Mustache", value: "mustache" },
          { label: "Handlebars", value: "handlebars" },
          { label: "Liquid", value: "liquid" },
        ],
      },
      rules: {
        required: "Template syntax is required",
      },
    },
  },
  layout: [
    {
      kind: "section",
      title: "Template Information",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "subject_template" },
            { kind: "field", fieldId: "template_syntax" },
          ],
        },
        {
          kind: "stack",
          spacing: "md",
          children: [{ kind: "field", fieldId: "body_template" }],
        },
      ],
    },
    {
      kind: "section",
      title: "PDF Configuration",
      withDivider: true,
      children: [
        {
          kind: "stack",
          spacing: "md",
          children: [
            { kind: "field", fieldId: "include_pdf" },
            { kind: "field", fieldId: "pdf_template" },
          ],
        },
      ],
    },
    {
      kind: "section",
      title: "Storage Settings",
      withDivider: false,
      children: [
        {
          kind: "grid",
          cols: 1,
          spacing: "md",
          children: [{ kind: "field", fieldId: "storage_mode" }],
        },
      ],
    },
  ],
};
