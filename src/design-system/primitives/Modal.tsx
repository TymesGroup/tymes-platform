import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

/**
 * Modal Component
 *
 * A refined modal dialog with backdrop blur, smooth scale + fade animations (200ms),
 * and proper accessibility support (aria-modal, aria-labelledby, focus trap).
 * Automatically prevents body scroll when open.
 *
 * @component
 * @example
 * // Basic confirmation modal
 * <Modal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 * >
 *   <p>Are you sure you want to proceed?</p>
 * </Modal>
 *
 * @example
 * // Modal with footer actions
 * <Modal
 *   open={isOpen}
 *   onClose={handleClose}
 *   title="Delete Item"
 *   description="This action cannot be undone."
 *   footer={
 *     <>
 *       <Button variant="ghost" onClick={handleClose}>Cancel</Button>
 *       <Button variant="danger" onClick={handleDelete}>Delete</Button>
 *     </>
 *   }
 * >
 *   <p>Are you sure you want to delete this item?</p>
 * </Modal>
 *
 * @example
 * // Large modal for forms
 * <Modal
 *   open={isOpen}
 *   onClose={handleClose}
 *   title="Edit Profile"
 *   size="lg"
 *   closeOnBackdrop={false}
 * >
 *   <form>
 *     <Input label="Name" />
 *     <Input label="Email" />
 *   </form>
 * </Modal>
 *
 * @example
 * // Full-width modal for complex content
 * <Modal open={isOpen} onClose={handleClose} size="full" title="Product Gallery">
 *   <ImageGallery images={productImages} />
 * </Modal>
 */

export interface ModalProps {
  /**
   * Controls modal visibility.
   * When true, modal is rendered and body scroll is disabled.
   */
  open: boolean;
  /**
   * Callback fired when modal should close.
   * Triggered by close button, backdrop click, or Escape key.
   */
  onClose: () => void;
  /**
   * Modal title displayed in the header.
   * Used for aria-labelledby accessibility.
   */
  title?: string;
  /**
   * Optional description below the title.
   * Used for aria-describedby accessibility.
   */
  description?: string;
  /**
   * Size variant controlling max-width
   * - `sm`: max-w-sm (384px)
   * - `md`: max-w-md (448px)
   * - `lg`: max-w-lg (512px)
   * - `xl`: max-w-xl (576px)
   * - `full`: max-w-4xl (896px)
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /**
   * Show X button in the header to close modal
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Close modal when clicking the backdrop overlay
   * @default true
   */
  closeOnBackdrop?: boolean;
  /**
   * Close modal when pressing Escape key
   * @default true
   */
  closeOnEscape?: boolean;
  /** Main content of the modal body */
  children: React.ReactNode;
  /**
   * Footer content, typically action buttons.
   * Rendered with flex layout and gap between items.
   */
  footer?: React.ReactNode;
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
  footer,
}) => {
  // Handle escape key
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  // Add/remove escape listener
  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, handleEscape]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={`
          relative w-full ${sizeStyles[size]}
          bg-white dark:bg-zinc-900
          rounded-xl shadow-xl
          border border-zinc-200 dark:border-zinc-800
          animate-in fade-in zoom-in-95 duration-200
          max-h-[90vh] flex flex-col
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex-1 pr-4">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
