import { useMemo, useState } from "react";
import type { NotificationTemplate } from "./data-access/types";

export default function TemplatePreviewModal({
  template,
}: {
  template: NotificationTemplate;
}) {
  const [view, setView] = useState<"rendered" | "raw">("rendered");

  const compiledHtml = useMemo(() => {
    let html = template.body_template || "";

    Object.entries(template.sample_data || {}).forEach(([key, value]) => {
      html = html.replaceAll(`{{${key}}}`, String(value));
    });

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
  }, [template]);

  return (
    <div className="template-preview-container">

      <div className="template-toolbar">
        <button onClick={() => setView("rendered")}>Preview</button>
        <button onClick={() => setView("raw")}>Raw HTML</button>
        <button onClick={() => navigator.clipboard.writeText(template.body_template)}>
          Copy
        </button>
      </div>

      {view === "rendered" ? (
        <iframe
          title="Template Preview"
          srcDoc={compiledHtml}
          style={{
            width: "100%",
            height: "70vh",
            border: "1px solid #ddd",
            background: "white",
          }}
          sandbox=""
        />
      ) : (
        <pre className="template-raw-view">
          {template.body_template}
        </pre>
      )}
    </div>
  );
}
