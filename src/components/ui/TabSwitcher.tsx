
import React from 'react';
import { cn } from '@/lib/utils';
import { ImageIcon, Sparkles } from 'lucide-react';

export type TabValue = 'upscale' | 'face-enhancement';

interface Tab {
  value: TabValue;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface TabSwitcherProps {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
  disabled?: boolean;
}

const TABS: Tab[] = [
  {
    value: 'upscale',
    label: 'Image Upscaling',
    icon: ImageIcon,
    description: 'Nâng cấp ảnh lên 2K/4K',
  },
  {
    value: 'face-enhancement',
    label: 'Face Enhancement',
    icon: Sparkles,
    description: 'Cải thiện khuôn mặt với AI',
  },
];

/**
 * TabSwitcher Component
 * 
 * Tab switcher để chuyển đổi giữa Image Upscaling và Face Enhancement.
 * 
 * Features:
 * - 2 tabs với icons và descriptions
 * - Smooth animation khi chuyển tab
 * - Disabled state khi đang processing
 * - Responsive design
 * - Dark mode support
 */
export function TabSwitcher({ activeTab, onTabChange, disabled = false }: TabSwitcherProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="glass-card rounded-2xl p-2">
        <div className="grid grid-cols-2 gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => !disabled && onTabChange(tab.value)}
                disabled={disabled}
                className={cn(
                  'relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ease-out',
                  'focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/40',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  isActive
                    ? 'bg-white dark:bg-slate-800 shadow-lg shadow-primary/10 dark:shadow-primary/20'
                    : 'hover:bg-white/50 dark:hover:bg-slate-800/50',
                  !disabled && 'cursor-pointer'
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-br from-primary to-primary-400 text-white shadow-glow-purple'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Label */}
                <div className="text-center">
                  <div
                    className={cn(
                      'text-sm font-semibold transition-colors duration-300',
                      isActive
                        ? 'text-slate-900 dark:text-slate-100'
                        : 'text-slate-600 dark:text-slate-400'
                    )}
                  >
                    {tab.label}
                  </div>
                  <div
                    className={cn(
                      'text-xs transition-colors duration-300 mt-0.5',
                      isActive
                        ? 'text-slate-600 dark:text-slate-400'
                        : 'text-slate-500 dark:text-slate-500'
                    )}
                  >
                    {tab.description}
                  </div>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary to-primary-400 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
