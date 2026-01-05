import React from "react";
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
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="custom-modal-overlay"
      style={{ display: isOpen ? "flex" : "none" }}
      onClick={handleOverlayClick}
    >
      <div className={`custom-modal-box modal-${size} ${className}`}>
        <div className="custom-modal-header">
          <h2>{title}</h2>
          <button className="custom-modal-close-icon" onClick={onClose}>
            ✖
          </button>
        </div>

        <div className="custom-modal-body">
          {body}
        </div>

        <footer className="custom-modal-footer">
          {footer || ""}
        </footer>
      </div>
    </div>
  );
};

export default Modal;
