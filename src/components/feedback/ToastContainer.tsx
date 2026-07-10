
import React from 'react';
import { Toast } from './Toast';
import { useUpscale } from '@/context/UpscaleContext';

export function ToastContainer() {
  const { toasts, removeToast } = useUpscale();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}
