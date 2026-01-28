import { useMemo } from "react";
import type { NotificationTemplate } from "./data-access/types";

export default function TemplatePreviewModal({
                                                 template,
                                                 view,
                                             }: {
    template: NotificationTemplate;
    view: "rendered" | "raw";
}) {
    const compiledHtml = useMemo(() => {
        let html = template.body_template || "";

        Object.entries(template || {}).forEach(([key, value]) => {
            html = html.replaceAll(`{{${key}}}`, String(value));
        });

        return `
      <!DOCTYPE html>
      <html lang="eng">
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

    if (view === "raw") {
        return <pre className="template-raw-view">{template.body_template}</pre>;
    }

    return (
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
    );
}
