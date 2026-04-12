import { AlertTriangle, X } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  isDestructive = false,
  isLoading = false
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="relative z-50">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${isDestructive ? 'bg-red-100' : 'bg-primary-100'}`}>
                  <AlertTriangle className={`h-6 w-6 ${isDestructive ? 'text-red-600' : 'text-primary-600'}`} aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-semibold leading-6 text-slate-900">{title}</h3>
                  <div className="mt-2">
                    <p className="text-sm text-slate-500">{description}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`inline-flex w-full justify-center rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto disabled:opacity-50 ${isDestructive ? 'bg-red-600 hover:bg-red-500' : 'bg-primary-600 hover:bg-primary-500'}`}
              >
                {isLoading ? 'Processing...' : confirmText}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
            <button onClick={onClose} disabled={isLoading} className="absolute top-4 right-4 text-slate-400 hover:text-slate-500">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
