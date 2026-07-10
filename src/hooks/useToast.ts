
import { useState, useCallback } from 'react';
import type { ToastMessage } from '@/types';
import { generateId } from '@/lib/utils';
import { TOAST_DURATION } from '@/lib/constants';

export interface UseToastReturn {
  toasts: ToastMessage[];
  addToast: (message: string, type: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastMessage['type']) => {
      const id = generateId();
      const newToast: ToastMessage = { id, message, type };

      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss after duration
      setTimeout(() => {
        removeToast(id);
      }, TOAST_DURATION);
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string) => {
      addToast(message, 'success');
    },
    [addToast]
  );

  const error = useCallback(
    (message: string) => {
      addToast(message, 'error');
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string) => {
      addToast(message, 'warning');
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
  };
}
