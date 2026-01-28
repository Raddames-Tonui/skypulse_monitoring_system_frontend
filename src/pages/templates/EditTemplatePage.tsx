import { useState, useMemo, useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { useFetchTemplate } from "./data-access/useFetchData";
import { useUpdateTemplate } from "./data-access/useMutateData";
import Loader from "@components/layout/Loader.tsx";
import toast from "react-hot-toast";
import "./EditTemplatePage.css";
import Modal from "@components/modal/Modal.tsx";

/**
 * Native HTML Beautifier
 * Formats minified HTML into a readable indented structure
 */
const beautifyHTML = (html: string) => {
  if (!html) return "";
  let result = '';
  let indent = '';
  const tab = '  ';
  const elements = html.split(/>\s*</);

  elements.forEach((element) => {
    const isClosing = element.startsWith('/');
    const isSelfClosing = element.endsWith('/') ||
        /^(img|br|hr|input|meta|link|area|base|col|embed|keygen|param|source|track|wbr)/i.test(element.split(/[ >]/)[0]);

    if (isClosing) {
      indent = indent.substring(tab.length);
    }

    result += indent + '<' + element + '>\n';

    if (!isClosing && !isSelfClosing) {
      indent += tab;
    }
  });

  return result.replace(/^<|>\n$/g, '').trim();
};

export default function EditTemplatePage() {
  const { uuid } = useParams({ strict: false });
  const { data: templateResp, isLoading, isError, error } = useFetchTemplate(uuid);
  const { mutate: updateTemplate, isPending } = useUpdateTemplate();

  const [subjectTemplate, setSubjectTemplate] = useState("");
  const [bodyTemplate, setBodyTemplate] = useState("");
  const [pdfTemplate, setPdfTemplate] = useState("");
  const [includePdf, setIncludePdf] = useState(false);
  const [storageMode, setStorageMode] = useState<"HYBRID" | "DATABASE" | "FILESYSTEM">("HYBRID");
  const [templateSyntax, setTemplateSyntax] = useState<"mustache">("mustache");


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [showPlaceholders, setShowPlaceholders] = useState(false);

  useEffect(() => {
    const t = templateResp?.data;
    if (!t) return;
    setSubjectTemplate(t.subject_template || "");

    const formatted = beautifyHTML(t.body_template || "");
    setBodyTemplate(formatted);

    setSubjectTemplate(t.subject_template || "");
    setBodyTemplate(beautifyHTML(t.body_template || ""));
    setPdfTemplate(t.pdf_template || "");
    setIncludePdf(t.include_pdf || false);
    setStorageMode(t.storage_mode || "HYBRID");
    setTemplateSyntax(t.template_syntax || "mustache");
  }, [templateResp]);

  // Live preview logic
  const compiledHtml = useMemo(() => {
    let html = bodyTemplate || "";
    const t = templateResp?.data;

    if (t?.placeholders) {
      t.placeholders.forEach(ph => {
        const key = ph.placeholder_key;
        const displayLabel = `[${key}]`;
        const replacement = `<span class="placeholder">${displayLabel}</span>`;
        html = html.split(`{{${key}}}`).join(replacement);
      });
    }

    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <style>
          body { margin:0; padding:24px; font-family:Arial,sans-serif; background:#f6f7f9; }
          .email-container { 
            background:white; 
            max-width:600px; 
            margin:0 auto; 
            padding:24px; 
            box-shadow:0 2px 8px rgba(0,0,0,0.1); 
            min-height: 400px; 
          }
          .placeholder { 
            background:#fff3cd; 
            border-bottom:1px dashed #856404; 
            padding:2px 4px; 
            border-radius:2px; 
            color:#856404; 
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          ${html || "<p style='color:#999'>Start typing to see a preview...</p>"}
        </div>
      </body>
    </html>
  `;
  }, [bodyTemplate, templateResp]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = templateResp?.data;
    if (!t) return;

    updateTemplate(
        {
          template_id: t.notification_template_id,
          subject_template: subjectTemplate,
          body_template: bodyTemplate,
          pdf_template: pdfTemplate || null,
          include_pdf: includePdf,
          storage_mode: storageMode,
          template_syntax: templateSyntax,
        },
        {
          onSuccess: () => {
            window.history.back();
          },
          onError: (err: any) => toast.error(err?.message || "Failed to update template"),
        }
    );
  };

  if (isLoading) return <Loader />;
  if (isError) return <div className="error">Error: {error?.message}</div>;
  if (!templateResp?.data) return <div className="error">Template not found</div>;

  const t = templateResp.data;



    return (
      <>

        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Edit Template</h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={() => window.history.back()} disabled={isPending}>Cancel</button>
            <button type="submit" form="edit-template-form" className="btn-primary" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <section className="template-section">
          <form
              id="edit-template-form"
              onSubmit={handleSubmit}
              className="template-details-form"
          >
            <div className="form-group">
              <label>Subject</label>
              <input
                  type="text"
                  value={subjectTemplate}
                  onChange={(e) => setSubjectTemplate(e.target.value)}
                  required
              />
            </div>

            <div className="form-group">
              <label>Template Syntax</label>
              <select
                  value={templateSyntax}
                  onChange={(e) => setTemplateSyntax(e.target.value as any)}
              >
                <option value="mustache">Mustache</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <input
                    type="checkbox"
                    checked={includePdf}
                    onChange={(e) => setIncludePdf(e.target.checked)}
                />{" "}
                Include PDF
              </label>
            </div>

            {includePdf && (
                <div className="form-group">
                  <label>PDF Template (HTML)</label>
                  <textarea
                      value={pdfTemplate}
                      onChange={(e) => setPdfTemplate(e.target.value)}
                      rows={6}
                  />
                </div>
            )}

            <div className="form-group">
              <label>Storage Mode</label>
              <select
                  value={storageMode}
                  onChange={(e) => setStorageMode(e.target.value as any)}
              >
                <option value="DATABASE">Database</option>
                <option value="FILESYSTEM">File System</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
          </form>
        </section>



        <section className="editor-section">
          <div className="body-editor">
              <div>
                  <h3 >Body (HTML)</h3>
                  <div className="editor-buttons">
                      <button
                          type="button"
                          className="btn-secondary btn-sm"
                          onClick={() => setIsEditModalOpen(true)}
                      >
                          Edit Fullscreen
                      </button>
                      <button
                          type="button"
                          className="btn-secondary btn-sm"
                          onClick={() => setShowPlaceholders(!showPlaceholders)}
                      >
                          Placeholders
                      </button>
                  </div>

              </div>
              <div>

                  {showPlaceholders && (
                      <div className="placeholders-overlay">
                          <div className="placeholders-top-bar">
                              <span className="placeholder-hint">Click tag to copy:</span>
                              <div className="placeholder-grid">
                                  {t.placeholders?.map((ph) => (
                                      <div
                                          key={ph.placeholder_key}
                                          className="placeholder-item"
                                          onClick={() => {
                                              navigator.clipboard.writeText(`{{${ph.placeholder_key}}}`);
                                              toast.success(`Copied {{${ph.placeholder_key}}}`);
                                          }}
                                      >
                                          <code className="placeholder-key-chip">
                                              {`{{${ph.placeholder_key}}}`}
                                          </code>
                                          <span className="placeholder-desc">{ph.description}</span>
                                      </div>
                                  ))}
                              </div>
                              <button
                                  className="btn-secondary btn-sm"
                                  style={{ marginTop: "8px" }}
                                  onClick={() => setShowPlaceholders(false)}
                              >
                                  Close
                              </button>
                          </div>
                      </div>
                  )}

              </div>
            <div className="editor-inner">

              <textarea
                  value={bodyTemplate}
                  onChange={(e) => setBodyTemplate(e.target.value)}
                  className="editor-textarea"
                  spellCheck={false}
              />
            </div>
          </div>

          <div className="body-editor">
              <div>
              <div><h3>Live Preview</h3>
                  <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => setIsPreviewModalOpen(true)}
                  >
                      Full Preview
                  </button>
              </div>
            <div className="iframe-wrapper">
              <iframe
                  title="Live Preview"
                  srcDoc={compiledHtml}
                  sandbox="allow-same-origin"
              />
            </div>
          </div>
        </section>

        <Modal
            isOpen={isEditModalOpen}
            title="Edit HTML Template (Fullscreen)"
            size="fullscreen"
            onClose={() => setIsEditModalOpen(false)}
            body={
              <div style={{ height: "100%", background: "#020617" }}>
          <textarea
              value={bodyTemplate}
              onChange={(e) => setBodyTemplate(e.target.value)}
              spellCheck={false}
              style={{
                width: "100%",
                height: "100%",
                background: "#eae9e9",
                color: "#e5e7eb",
                // fontFamily: "Fira Code, monospace",
                fontSize: "15px",
                lineHeight: "1.7",
                padding: "24px",
                border: "none",
                outline: "none",
                resize: "none",
              }}
          />
              </div>
            }
            footer={
              <>
                <button
                    className="btn-secondary"
                    onClick={() => setIsEditModalOpen(false)}
                >
                  Back
                </button>
                <button
                    className="btn-primary"
                    onClick={handleSubmit}
                    disabled={isPending}
                >
                  {isPending ? "Saving..." : "Save & Close"}
                </button>
              </>
            }
        />

        <Modal
            isOpen={isPreviewModalOpen}
            title="Email Preview (Fullscreen)"
            size="fullscreen"
            onClose={() => setIsPreviewModalOpen(false)}
            body={
              <iframe
                  title="Email Preview"
                  srcDoc={compiledHtml}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    background: "#ffffff",
                  }}
              />
            }
            showCloseButton
        />
      </>
  );


}
