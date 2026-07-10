
import React from 'react';
import { Sparkles, Palette, Eraser } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FaceMode } from '@/types/face-enhancement';

/**
 * Props for FaceModeSelector component.
 * 
 * Requirements: 7.1, 7.2, 7.3, 11.1, 11.2, 11.3
 */
interface FaceModeSelectorProps {
  /** Current selected mode */
  mode: FaceMode;
  
  /** Callback when mode changes */
  onModeChange: (mode: FaceMode) => void;
  
  /** Fidelity weight (0-1, only for restoration mode) */
  weight: number;
  
  /** Callback when weight changes */
  onWeightChange: (weight: number) => void;
  
  /** Face upsample flag (only for restoration mode) */
  faceUpsample: boolean;
  
  /** Callback when face upsample changes */
  onFaceUpsampleChange: (enabled: boolean) => void;
  
  /** Background enhancement flag (for all modes) */
  backgroundEnhance: boolean;
  
  /** Callback when background enhance changes */
  onBackgroundEnhanceChange: (enabled: boolean) => void;
  
  /** Background upscale factor (1, 2, or 4) */
  bgUpscale: 1 | 2 | 4;
  
  /** Callback when bg upscale changes */
  onBgUpscaleChange: (scale: 1 | 2 | 4) => void;
  
  /** Disable all controls */
  disabled?: boolean;
}

/**
 * Mode option configuration.
 */
interface ModeOption {
  value: FaceMode;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Available face enhancement modes.
 */
const MODE_OPTIONS: ModeOption[] = [
  {
    value: 'restoration',
    label: 'Restoration',
    description: 'Enhance facial details in old or low-quality photos',
    icon: Sparkles,
  },
  {
    value: 'colorization',
    label: 'Colorization',
    description: 'Add color to black-and-white or grayscale photos',
    icon: Palette,
  },
  {
    value: 'inpainting',
    label: 'Inpainting',
    description: 'Fill damaged or masked regions in faces',
    icon: Eraser,
  },
];

/**
 * FaceModeSelector Component
 * 
 * Allows users to select face enhancement mode and configure mode-specific parameters.
 * 
 * Features:
 * - 3 mode options: Restoration, Colorization, Inpainting
 * - Weight slider (only visible for restoration mode)
 * - Face upsample checkbox (only visible for restoration mode)
 * - Background enhancement checkbox (visible for all modes)
 * - Background upscale selector (only visible when background_enhance=true)
 * - Responsive design with Tailwind CSS
 * - Accessible with keyboard navigation
 * 
 * @example
 * ```tsx
 * <FaceModeSelector
 *   mode="restoration"
 *   onModeChange={(mode) => setMode(mode)}
 *   weight={0.7}
 *   onWeightChange={(w) => setWeight(w)}
 *   faceUpsample={true}
 *   onFaceUpsampleChange={(enabled) => setFaceUpsample(enabled)}
 *   backgroundEnhance={true}
 *   onBackgroundEnhanceChange={(enabled) => setBackgroundEnhance(enabled)}
 *   bgUpscale={2}
 *   onBgUpscaleChange={(scale) => setBgUpscale(scale)}
 * />
 * ```
 * 
 * Requirements: 7.1, 7.2, 7.3, 11.1, 11.2, 11.3
 */
export function FaceModeSelector({
  mode,
  onModeChange,
  weight,
  onWeightChange,
  faceUpsample,
  onFaceUpsampleChange,
  backgroundEnhance,
  onBackgroundEnhanceChange,
  bgUpscale,
  onBgUpscaleChange,
  disabled = false,
}: FaceModeSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Mode selector - Radio buttons */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
          Enhancement Mode
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MODE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = mode === option.value;
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => !disabled && onModeChange(option.value)}
                disabled={disabled}
                className={cn(
                  'relative flex flex-col items-start p-4 rounded-lg border-2 transition-all duration-300 ease-out',
                  'focus:outline-none focus:ring-4 focus:ring-primary/20 dark:focus:ring-primary/30',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  isSelected
                    ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md shadow-primary/10 dark:shadow-primary/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/5 hover:shadow-sm hover:scale-[1.02]',
                  !disabled && 'cursor-pointer'
                )}
                aria-pressed={isSelected}
                aria-label={`Select ${option.label} mode`}
              >
                {/* Radio indicator */}
                <div className="absolute top-4 right-4">
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                      isSelected
                        ? 'border-primary bg-primary'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    )}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>
                
                {/* Icon and label */}
                <div className="flex items-center gap-3 mb-2">
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-colors',
                      isSelected
                        ? 'text-primary'
                        : 'text-slate-400 dark:text-slate-500'
                    )}
                  />
                  <span
                    className={cn(
                      'text-base font-semibold transition-colors',
                      isSelected
                        ? 'text-primary'
                        : 'text-slate-900 dark:text-slate-100'
                    )}
                  >
                    {option.label}
                  </span>
                </div>
                
                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 text-left">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Restoration mode parameters - Only show when mode is restoration */}
      {mode === 'restoration' && (
        <div className="space-y-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          {/* Weight slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="fidelity-weight"
                className="text-sm font-medium text-slate-900 dark:text-slate-100"
              >
                Fidelity Weight
              </label>
              <span className="text-sm font-semibold text-primary">
                {weight.toFixed(2)}
              </span>
            </div>
            
            <input
              id="fidelity-weight"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={weight}
              onChange={(e) => onWeightChange(parseFloat(e.target.value))}
              disabled={disabled}
              className={cn(
                'w-full h-2 rounded-lg appearance-none cursor-pointer transition-all duration-200',
                'bg-slate-200 dark:bg-slate-700',
                '[&::-webkit-slider-thumb]:appearance-none',
                '[&::-webkit-slider-thumb]:w-4',
                '[&::-webkit-slider-thumb]:h-4',
                '[&::-webkit-slider-thumb]:rounded-full',
                '[&::-webkit-slider-thumb]:bg-primary',
                '[&::-webkit-slider-thumb]:cursor-pointer',
                '[&::-webkit-slider-thumb]:transition-all',
                '[&::-webkit-slider-thumb]:duration-200',
                '[&::-webkit-slider-thumb]:hover:scale-110',
                '[&::-webkit-slider-thumb]:hover:shadow-lg',
                '[&::-webkit-slider-thumb]:hover:shadow-primary/30',
                '[&::-webkit-slider-thumb]:active:scale-95',
                '[&::-moz-range-thumb]:w-4',
                '[&::-moz-range-thumb]:h-4',
                '[&::-moz-range-thumb]:rounded-full',
                '[&::-moz-range-thumb]:bg-primary',
                '[&::-moz-range-thumb]:border-0',
                '[&::-moz-range-thumb]:cursor-pointer',
                '[&::-moz-range-thumb]:transition-all',
                '[&::-moz-range-thumb]:duration-200',
                '[&::-moz-range-thumb]:hover:scale-110',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              aria-label="Fidelity weight slider"
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={weight}
            />
            
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Higher values preserve more original detail (0 = more enhancement, 1 = more fidelity)
            </p>
          </div>
          
          {/* Face upsample checkbox */}
          <div className="flex items-start gap-3">
            <input
              id="face-upsample"
              type="checkbox"
              checked={faceUpsample}
              onChange={(e) => onFaceUpsampleChange(e.target.checked)}
              disabled={disabled}
              className={cn(
                'mt-0.5 w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-600',
                'text-primary focus:ring-4 focus:ring-primary/20 dark:focus:ring-primary/30',
                'cursor-pointer transition-all duration-200',
                'hover:border-primary dark:hover:border-primary',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              aria-label="Enable face upsampling"
            />
            <div className="flex-1">
              <label
                htmlFor="face-upsample"
                className={cn(
                  'text-sm font-medium text-slate-900 dark:text-slate-100',
                  !disabled && 'cursor-pointer'
                )}
              >
                Upsample face regions
              </label>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Increase resolution of detected face areas after enhancement
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Mode-specific info for non-restoration modes */}
      {mode !== 'restoration' && (
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            {mode === 'colorization' && (
              <>
                <strong>Note:</strong> Colorization mode uses fixed parameters optimized for adding color to grayscale images.
              </>
            )}
            {mode === 'inpainting' && (
              <>
                <strong>Note:</strong> Inpainting mode automatically detects and fills damaged regions (black or transparent pixels).
              </>
            )}
          </p>
        </div>
      )}
      
      {/* Background Enhancement - Show for all modes */}
      <div className="space-y-4 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-3">
          <input
            id="background-enhance"
            type="checkbox"
            checked={backgroundEnhance}
            onChange={(e) => onBackgroundEnhanceChange(e.target.checked)}
            disabled={disabled}
            className={cn(
              'mt-0.5 w-4 h-4 rounded border-2 border-purple-300 dark:border-purple-600',
              'text-purple-600 focus:ring-4 focus:ring-purple-500/20 dark:focus:ring-purple-500/30',
              'cursor-pointer transition-all duration-200',
              'hover:border-purple-500 dark:hover:border-purple-400',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            aria-label="Enable background enhancement"
          />
          <div className="flex-1">
            <label
              htmlFor="background-enhance"
              className={cn(
                'text-sm font-semibold text-purple-900 dark:text-purple-100',
                !disabled && 'cursor-pointer'
              )}
            >
              Enhance Background
            </label>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
              Use Real-ESRGAN to enhance the entire image (faces + background) for better overall quality. 
              When disabled, only face regions will be enhanced.
            </p>
          </div>
        </div>
        
        {/* Background upscale selector - Only show when background_enhance is true */}
        {backgroundEnhance && (
          <div className="space-y-2 pl-7 animate-in fade-in slide-in-from-top-2 duration-300">
            <label
              htmlFor="bg-upscale"
              className="block text-sm font-medium text-purple-900 dark:text-purple-100"
            >
              Background Upscale Factor
            </label>
            
            <div className="grid grid-cols-3 gap-2">
              {([1, 2, 4] as const).map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => !disabled && onBgUpscaleChange(scale)}
                  disabled={disabled}
                  className={cn(
                    'px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200',
                    'focus:outline-none focus:ring-4 focus:ring-purple-500/20 dark:focus:ring-purple-500/30',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    bgUpscale === scale
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 dark:shadow-purple-600/50'
                      : 'bg-white dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 border border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:border-purple-300 dark:hover:border-purple-600',
                    !disabled && 'cursor-pointer'
                  )}
                  aria-pressed={bgUpscale === scale}
                  aria-label={`Set background upscale to ${scale}x`}
                >
                  {scale}x
                </button>
              ))}
            </div>
            
            <p className="text-xs text-purple-700 dark:text-purple-300">
              {bgUpscale === 1 && (
                <>
                  <strong>1x:</strong> No upscaling, original resolution maintained. Background quality enhancement is skipped.
                </>
              )}
              {bgUpscale === 2 && (
                <>
                  <strong>2x:</strong> Doubles image dimensions (e.g., 1920×1080 → 3840×2160). Balanced quality and processing time.
                </>
              )}
              {bgUpscale === 4 && (
                <>
                  <strong>4x:</strong> Quadruples image dimensions (e.g., 1920×1080 → 7680×4320). Maximum quality, longer processing time.
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
