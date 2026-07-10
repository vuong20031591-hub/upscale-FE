
import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function Spinner({ size = 'md', className, text }: SpinnerProps) {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div
        className={cn(
          'border-[#256af0]/20 border-t-[#256af0] rounded-full animate-spin',
          sizes[size]
        )}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className="text-slate-600 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );
}
