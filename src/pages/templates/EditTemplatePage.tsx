import { useState, useMemo, useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import { useUpdateTemplate } from "./data-access/useMutateData";
import type { NotificationTemplate } from "./data-access/types";
import Loader from "@/components/Loader";
import "./EditTemplatePage.css";

export default function EditTemplatePage() {
  const { uuid } = useParams({ strict: false });
  const { mutate: updateTemplate, isPending } = useUpdateTemplate();

  const [subjectTemplate, setSubjectTemplate] = useState("");
  const [bodyTemplate, setBodyTemplate] = useState("");
  const [pdfTemplate, setPdfTemplate] = useState("");
  const [includePdf, setIncludePdf] = useState(false);
  const [storageMode, setStorageMode] = useState<"DB" | "FILE" | "HYBRID">("HYBRID");
  const [templateSyntax, setTemplateSyntax] = useState<"mustache" | "handlebars" | "liquid">("mustache");

  // Fetch template data
  const { data: template, isLoading, isError, error } = useQuery<NotificationTemplate, Error>({
    queryKey: ["notification-template", uuid],
    queryFn: async () => {
      if (!uuid) throw new Error("Missing UUID");
      const response = await axiosClient.get(`/notifications/templates`, {
        params: { uuid }
      });
      const templates = response.data?.data;
      if (!templates || templates.length === 0) throw new Error("Template not found");
      
      // Find the template with matching UUID
      const matchedTemplate = templates.find((t: NotificationTemplate) => t.uuid === uuid);
      if (!matchedTemplate) throw new Error("Template not found");
      
      return matchedTemplate as NotificationTemplate;
    },
    enabled: !!uuid,
  });

  // Initialize form with template data
  useEffect(() => {
    if (template) {
      setSubjectTemplate(template.subject_template || "");
      setBodyTemplate(template.body_template || "");
      setPdfTemplate(template.pdf_template || "");
      setIncludePdf(template.include_pdf || false);
      setStorageMode(template.storage_mode || "HYBRID");
      setTemplateSyntax(template.template_syntax || "mustache");
    }
  }, [template]);

  // Live preview with sample data
  const compiledHtml = useMemo(() => {
    let html = bodyTemplate || "";
    
    if (template?.sample_data) {
      Object.entries(template.sample_data).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
        html = html.replace(regex, String(value));
      });
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body {
              margin: 0;
              padding: 24px;
              font-family: Arial, Helvetica, sans-serif;
              background: #f6f7f9;
            }
            .email-container {
              background: white;
              max-width: 700px;
              margin: 1rem auto;
              padding: 24px;
              box-shadow: 0 0 0 1px #ddd;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            ${html}
          </div>
        </body>
      </html>
    `;
  }, [bodyTemplate, template?.sample_data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uuid) return;

    const payload = {
      uuid,
      subject_template: subjectTemplate,
      body_template: bodyTemplate,
      pdf_template: pdfTemplate || null,
      include_pdf: includePdf,
      storage_mode: storageMode,
      template_syntax: templateSyntax,
    };

    updateTemplate(payload, {
      onSuccess: () => {
        window.history.back();
      },
    });
  };

  const handleCancel = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="loading">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <div className="error">Error: {error?.message}</div>;
  }

  if (!template) {
    return <div className="error">Template not found</div>;
  }

  return (
    <div className="edit-template-page">
      <div className="page-header">
        <h1>Edit Template</h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleCancel}
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-template-form"
            className="btn-primary"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="template-info-bar">
        <div className="info-item">
          <strong>Event Type:</strong> {template.event_type}
        </div>
        <div className="info-item">
          <strong>Template ID:</strong> {template.notification_template_id}
        </div>
        <div className="info-item">
          <strong>Last Modified:</strong> {new Date(template.date_modified).toLocaleString()}
        </div>
      </div>

      <div className="edit-template-container">
        {/* Left side - Form */}
        <div className="template-form-section">
          <form id="edit-template-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Template Information</h3>
              
              <div className="form-field">
                <label htmlFor="subject_template">
                  Subject Template <span className="required">*</span>
                </label>
                <input
                  id="subject_template"
                  type="text"
                  value={subjectTemplate}
                  onChange={(e) => setSubjectTemplate(e.target.value)}
                  placeholder="Service {{service_name}} is down"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="template_syntax">
                  Template Syntax <span className="required">*</span>
                </label>
                <select
                  id="template_syntax"
                  value={templateSyntax}
                  onChange={(e) => setTemplateSyntax(e.target.value as any)}
                  required
                >
                  <option value="mustache">Mustache</option>
                  <option value="handlebars">Handlebars</option>
                  <option value="liquid">Liquid</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="body_template">
                  Body Template (HTML) <span className="required">*</span>
                </label>
                <textarea
                  id="body_template"
                  value={bodyTemplate}
                  onChange={(e) => setBodyTemplate(e.target.value)}
                  placeholder="Enter HTML template with {{variable}} syntax"
                  rows={12}
                  required
                />
                <small className="helper-text">
                  Use {`{{variable_name}}`} syntax for dynamic content
                </small>
              </div>
            </div>

            <div className="form-section">
              <h3>PDF Configuration</h3>
              
              <div className="form-field">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={includePdf}
                    onChange={(e) => setIncludePdf(e.target.checked)}
                  />
                  <span className="slider" />
                  Include PDF Attachment
                </label>
              </div>

              {includePdf && (
                <div className="form-field">
                  <label htmlFor="pdf_template">PDF Template (HTML)</label>
                  <textarea
                    id="pdf_template"
                    value={pdfTemplate}
                    onChange={(e) => setPdfTemplate(e.target.value)}
                    placeholder="<html>...</html>"
                    rows={8}
                  />
                </div>
              )}
            </div>

            <div className="form-section">
              <h3>Storage Settings</h3>
              
              <div className="form-field">
                <label htmlFor="storage_mode">
                  Storage Mode <span className="required">*</span>
                </label>
                <select
                  id="storage_mode"
                  value={storageMode}
                  onChange={(e) => setStorageMode(e.target.value as any)}
                  required
                >
                  <option value="DB">Database</option>
                  <option value="FILE">File System</option>
                  <option value="HYBRID">Hybrid (DB + File)</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Right side - Live Preview */}
        <div className="template-preview-section">
          <div className="preview-header">
            <h3>Live Preview</h3>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => navigator.clipboard.writeText(bodyTemplate)}
            >
              Copy HTML
            </button>
          </div>

          <div className="preview-subject">
            <strong>Subject:</strong> {subjectTemplate || "(empty)"}
          </div>

          <div className="preview-container">
            <iframe
              title="Template Preview"
              srcDoc={compiledHtml}
              className="preview-iframe"
              sandbox=""
            />
          </div>

          {template.sample_data && (
            <div className="sample-data-info">
              <strong>Sample Data:</strong>
              <pre>{JSON.stringify(template.sample_data, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}