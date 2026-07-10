
import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ToastMessage } from '@/types';

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

export function Toast({ toast, onRemove }: ToastProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
  };

  const styles = {
    success: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
  };

  const iconColors = {
    success: 'text-emerald-500',
    error: 'text-red-500',
    warning: 'text-amber-500',
  };

  const Icon = icons[toast.type];

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg',
        'animate-in slide-in-from-right-full duration-300',
        styles[toast.type]
      )}
      role="alert"
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0', iconColors[toast.type])} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
