import React, { useState } from "react";
import type { ReactNode } from "react";
import "@/components/modal/modal.css";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  body?: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "fullscreen";
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
                                       isOpen,
                                       title,
                                       body,
                                       footer,
                                       onClose,
                                       size = "md",
                                       className = "",
                                     }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const currentSizeClass = isExpanded ? "modal-fullscreen" : `modal-${size}`;

  return (
      <div
          className="custom-modal-overlay"
          style={{ display: "flex" }}
          onClick={handleOverlayClick}
      >
        <div className={`custom-modal-box ${currentSizeClass} ${className}`}>
          <div className="custom-modal-header">
            <h2>{title}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                  className="custom-modal-close-icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Collapse" : "Expand"}
                  type="button"
              >
                {isExpanded ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14h6m0 0v6m0-6L3 21M20 10h-6m0 0V4m0 6l7-7"/></svg>
                ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6m0 0v6m0-6L14 10M9 21H3m0 0v-6m0 6l7-7"/></svg>
                )}
              </button>

              <button className="custom-modal-close-icon" onClick={onClose} type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>

          <div className="custom-modal-body">{body}</div>

          <footer className="custom-modal-footer">{footer || ""}</footer>
        </div>
      </div>
  );
};

export default Modal;
