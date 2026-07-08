import React from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'secondary' | 'danger' | 'outline';
  loading?: boolean;
  error?: string | null;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  loading = false,
  error = null,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity cursor-default"
        onClick={loading ? undefined : onClose}
      />

      {/* Modal Card Content */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xl max-w-sm w-full mx-4 p-6 z-10 space-y-4 animate-in fade-in zoom-in-95 duration-100 text-center whitespace-normal">
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-800 tracking-tight break-words">
            {title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed break-words">
            {description}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded text-[11px] font-medium animate-shake break-words">
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row justify-center gap-2 pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          
          {onConfirm && (
            <Button
              variant={confirmVariant}
              size="sm"
              onClick={onConfirm}
              loading={loading}
              className="w-full sm:w-auto"
            >
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
