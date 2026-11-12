import React, { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "../utils";

/**
 * Modal — accessible, animated dialog with configurable sizes and behaviours.
 *
 * Usage:
 *   <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm Delete" size="sm">
 *     <Modal.Body>...</Modal.Body>
 *     <Modal.Footer>
 *       <Button variant="outline" onClick={onClose}>Cancel</Button>
 *       <Button variant="danger">Delete</Button>
 *     </Modal.Footer>
 *   </Modal>
 */

// ─── Modal Root ───────────────────────────────────────────────────────────────
const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseButton = true,
  children,
  className,
}) => {
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);

  // ── Keyboard handler ──────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;

      if (closeOnEsc && e.key === "Escape") {
        onClose?.();
        return;
      }

      // Trap focus inside the modal
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    },
    [isOpen, closeOnEsc, onClose]
  );

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement;
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
      // Auto-focus first focusable element
      requestAnimationFrame(() => {
        const first = panelRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        first?.focus();
      });
    } else {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus();
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // ── Size map ─────────────────────────────────────────────────────────────
  const sizes = {
    xs: "max-w-sm",
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw] max-h-[95vh]",
  };

  if (!isOpen) return null;

  return (
    // Portal-like fixed overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          "relative w-full bg-white rounded-2xl shadow-2xl",
          "animate-in fade-in zoom-in-95 duration-200",
          "flex flex-col max-h-[90vh]",
          sizes[size],
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
            <div>
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-gray-900 leading-snug"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="mt-1 text-sm text-gray-500"
                >
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-4 shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

Modal.displayName = "Modal";

// ─── Modal.Body ───────────────────────────────────────────────────────────────
const ModalBody = ({ className, children }) => (
  <div className={cn("px-6 py-5", className)}>{children}</div>
);
ModalBody.displayName = "ModalBody";

// ─── Modal.Footer ─────────────────────────────────────────────────────────────
const ModalFooter = ({ className, children }) => (
  <div
    className={cn(
      "flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60 rounded-b-2xl shrink-0",
      className
    )}
  >
    {children}
  </div>
);
ModalFooter.displayName = "ModalFooter";

// ─── ConfirmModal — convenience wrapper for destructive confirmations ─────────
/**
 * <ConfirmModal
 *   isOpen={confirmOpen}
 *   onClose={() => setConfirmOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Delete Item"
 *   message="Are you sure? This action cannot be undone."
 *   confirmLabel="Delete"
 *   confirmVariant="danger"
 *   isLoading={deleting}
 * />
 */
/**
 * ConfirmModal renders confirm/cancel buttons using native HTML buttons
 * to avoid circular import with the Button component.
 * Pass a custom `renderActions` prop if you need Button variants:
 *
 *   renderActions={({ onClose, onConfirm, isLoading }) => (
 *     <>
 *       <Button variant="outline" onClick={onClose}>Cancel</Button>
 *       <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>Delete</Button>
 *     </>
 *   )}
 */
function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  isLoading = false,
  icon,
  renderActions,
}) {
  const dangerBtn =
    "inline-flex items-center justify-center font-medium rounded-lg px-4 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <ModalBody>
        {icon && (
          <div className="flex justify-center mb-4">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full",
                confirmVariant === "danger" ? "bg-red-100" : "bg-amber-100"
              )}
            >
              {icon}
            </div>
          </div>
        )}
        {message && (
          <p className="text-sm text-gray-600 leading-relaxed text-center">
            {message}
          </p>
        )}
      </ModalBody>
      <ModalFooter>
        {renderActions ? (
          renderActions({ onClose, onConfirm, isLoading })
        ) : (
          <>
            <button
              onClick={onClose}
              disabled={isLoading}
              className={cn(dangerBtn, "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500")}
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                dangerBtn,
                confirmVariant === "danger"
                  ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                  : "bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500"
              )}
            >
              {isLoading ? "…" : confirmLabel}
            </button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
}

// Attach sub-components
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export { Modal, ModalBody, ModalFooter, ConfirmModal };
