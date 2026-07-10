
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  className?: string;
  label?: string;
}

export function ProgressBar({
  progress,
  showPercentage = true,
  className,
  label,
}: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={cn('w-full space-y-2', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-sm font-medium text-slate-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-[#256af0] tabular-nums">
              {clampedProgress}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label || 'Progress'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clampedProgress}
        className="relative w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner"
      >
        {/* Progress bar với gradient và animation */}
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            "bg-gradient-to-r from-[#256af0] to-[#4a8fff]",
            "relative overflow-hidden"
          )}
          style={{ width: `${clampedProgress}%` }}
        >
          {/* Shimmer effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-translate"
          />
        </div>
      </div>
    </div>
  );
}
