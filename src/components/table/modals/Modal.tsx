import React from "react";
import type { ReactNode } from "react";
import "../css/modal.css"; 

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
      className="table-modal-overlay"
      style={{ display: isOpen ? "flex" : "none" }}
      onClick={handleOverlayClick}
    >
      <div className="table-modal-box">
        <header className="table-modal-header">
          <h2>{title}</h2>
          <button className="table-modal-close-icon" onClick={onClose}>
            ✖
          </button>
        </header>

        <div className="table-modal-body">{body}</div>

        <footer className="table-modal-footer">
          {footer || (
            <button className="table-modal-close-btn" onClick={onClose}>
              Close
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default Modal;