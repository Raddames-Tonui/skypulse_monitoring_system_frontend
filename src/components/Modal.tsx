import React from "react";
import type { ReactNode } from "react";
import "@/css/modal.css";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  body?: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  body,
  footer,
  onClose,
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
      <div className="custom-modal-box">
        <header className="custom-modal-header">
          <h2>{title}</h2>
          <button className="custom-modal-close-icon" onClick={onClose}>
            ✖
          </button>
        </header>

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
