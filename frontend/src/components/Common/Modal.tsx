/**
 * Modal Component
 * Accessible modal dialog for confirmations, alerts, and detailed content
 * Implements focus management and keyboard navigation
 */

import React, { useEffect, useRef } from "react";
// import { cn } from "../../lib/cn.ts";
import { ModalProps } from "../../types";
// import Button from "./Button";
import { X } from "lucide-react";

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard events (ESC to close)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50 transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-200 px-6 py-4">
          <div>
            <h2
              id="modal-title"
              className="text-xl font-bold text-neutral-900"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-neutral-600">{description}</p>
            )}
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">{children}</div>

        {/* Footer / Actions */}
        {actions && (
          <div className="border-t border-neutral-200 px-6 py-4 flex justify-end gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;