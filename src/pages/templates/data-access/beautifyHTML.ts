import toast from "react-hot-toast";
import Loader from "@components/layout/Loader.tsx";
import {useMemo} from "react";

export const beautifyHTML = (html) => {
    if (!html) return "";
    let result = '';
    let indent = '';
    const tab = '  ';

    const elements = html.split(/>\s*</);

    elements.forEach((element, index) => {
        const isClosing = element.startsWith('/');
        const isSelfClosing = element.endsWith('/') ||
            /^(img|br|hr|input|meta|link)/i.test(element.split(' ')[0]);

        if (isClosing) {
            indent = indent.substring(tab.length); // Decrease indent
        }

        result += indent + '<' + element + '>\n';

        if (!isClosing && !isSelfClosing) {
            indent += tab;
        }
    });

    return result.replace(/^<|>\n$/g, '').trim();
};



// Live preview logic
export const compiledHtml = useMemo(() => {
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
            max-width:600px; /* Standard email width */
            margin:0 auto; 
            padding:24px; 
            box-shadow:0 2px 8px rgba(0,0,0,0.1); 
            border-radius:8px; 
            min-height:200px; 
          }
          /* Stylized placeholder for the preview */
          .placeholder { 
            background:#fff3cd; 
            border-bottom:1px dashed #856404; 
            padding:2px 4px; 
            border-radius:2px; 
            color:#856404; 
            font-weight: bold;
            font-family: monospace;
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

