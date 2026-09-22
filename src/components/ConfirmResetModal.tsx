import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmResetModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmResetModal: React.FC<ConfirmResetModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-reset-title"
    >
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 id="confirm-reset-title" className="text-lg font-bold text-neutral-900 mb-1">
          Start Over?
        </h3>

        <p className="text-sm text-neutral-600 mb-6">
          You have unsaved changes. Starting over will discard all edits and return to the upload screen.
        </p>

        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-300 text-neutral-700 font-semibold text-sm hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Keep Editing
          </button>
          <button
            type="button"
            id="btn-confirm-start-over"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};
