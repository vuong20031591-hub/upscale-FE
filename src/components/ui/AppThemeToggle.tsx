// Theme toggle switch component với smooth animation

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={cn(
        'relative w-14 h-8 rounded-full transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-primary/20',
        isDark 
          ? 'bg-indigo-900' 
          : 'bg-slate-200'
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Toggle circle */}
      <div
        className={cn(
          'absolute top-1 w-6 h-6 rounded-full transition-all duration-300',
          'flex items-center justify-center',
          'shadow-md',
          isDark 
            ? 'left-7 bg-indigo-600' 
            : 'left-1 bg-white'
        )}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-white" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        )}
      </div>
    </button>
  );
}
