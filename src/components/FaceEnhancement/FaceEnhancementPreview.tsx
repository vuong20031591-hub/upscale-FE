
import React from 'react';
// next/image replaced with native img
import { ImageIcon, Clock, Users, Zap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/Spinner';
import { SkeletonImage, Skeleton } from '@/components/ui/Skeleton';
import type { FaceEnhancementMetadata } from '@/types/face-enhancement';

/**
 * Props for FaceEnhancementPreview component.
 * 
 * Requirements: 7.4, 7.5, 7.6, 7.7
 */
interface FaceEnhancementPreviewProps {
  /** Original image URL (data URL or blob URL) */
  originalImage: string | null;
  
  /** Enhanced image URL (data URL or blob URL) */
  enhancedImage: string | null;
  
  /** Processing state */
  isProcessing: boolean;
  
  /** Processing metadata (available after completion) */
  metadata?: FaceEnhancementMetadata;
  
  /** Warning message (e.g., "No faces detected") */
  warning?: string;
  
  /** Optional class name for container */
  className?: string;
}

/**
 * FaceEnhancementPreview Component
 * 
 * Displays before/after comparison of face enhancement with metadata.
 * 
 * Features:
 * - Side-by-side before/after image comparison
 * - Loading state with spinner and message
 * - Metadata display (faces detected, processing time, mode)
 * - Warning message display for edge cases
 * - Empty states for no image uploaded
 * - Responsive design with Tailwind CSS
 * - Dark mode support
 * 
 * @example
 * ```tsx
 * <FaceEnhancementPreview
 *   originalImage={originalUrl}
 *   enhancedImage={enhancedUrl}
 *   isProcessing={false}
 *   metadata={{
 *     facesDetected: 2,
 *     processingTime: 4.5,
 *     modeUsed: 'restoration',
 *     weightUsed: 0.7
 *   }}
 * />
 * ```
 * 
 * Requirements: 7.4, 7.5, 7.6, 7.7
 */
export function FaceEnhancementPreview({
  originalImage,
  enhancedImage,
  isProcessing,
  metadata,
  warning,
  className,
}: FaceEnhancementPreviewProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Before/After comparison grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original image */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Original
          </h3>
          
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md">
            {originalImage ? (
              <img
                src={originalImage}
                alt="Original image"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 dark:text-slate-400 font-medium text-center">
                  No image uploaded
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-sm text-center mt-1">
                  Upload an image to start
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced image */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Enhanced
          </h3>
          
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md">
            {isProcessing ? (
              // Loading state with skeleton
              <div className="absolute inset-0">
                <SkeletonImage aspectRatio="square" animation="wave" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-900/20 dark:bg-slate-900/40 backdrop-blur-sm">
                  <Spinner size="lg" className="mb-4" />
                  <p className="text-slate-900 dark:text-slate-100 font-semibold text-center">
                    Processing...
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm text-center mt-1">
                    Enhancing faces in your image
                  </p>
                </div>
              </div>
            ) : enhancedImage ? (
              // Enhanced image result
              <img
                src={enhancedImage}
                alt="Enhanced image"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              // Empty state
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 dark:text-slate-400 font-medium text-center">
                  No result yet
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-sm text-center mt-1">
                  Process an image to see results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Metadata display - Only show when processing is complete and we have metadata */}
      {!isProcessing && metadata && enhancedImage && (
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800/70">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Processing Details
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Faces detected */}
            <div className="flex items-start gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-white dark:hover:bg-slate-800">
              <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 transition-all duration-200 group-hover:bg-primary/20">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Faces Detected
                </p>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {metadata.facesDetected}
                </p>
              </div>
            </div>
            
            {/* Processing time */}
            <div className="flex items-start gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-white dark:hover:bg-slate-800">
              <div className="p-2 rounded-lg bg-cta/10 dark:bg-cta/20 transition-all duration-200 group-hover:bg-cta/20">
                <Clock className="w-4 h-4 text-cta" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Processing Time
                </p>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {metadata.processingTime.toFixed(2)}s
                </p>
              </div>
            </div>
            
            {/* Mode used */}
            <div className="flex items-start gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-white dark:hover:bg-slate-800">
              <div className="p-2 rounded-lg bg-success/10 dark:bg-success/20 transition-all duration-200 group-hover:bg-success/20">
                <Zap className="w-4 h-4 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Mode Used
                </p>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100 capitalize">
                  {metadata.modeUsed}
                </p>
              </div>
            </div>
          </div>
          
          {/* Additional details section */}
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
            {/* Weight used - Only show for restoration mode */}
            {metadata.modeUsed === 'restoration' && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Fidelity Weight
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {metadata.weightUsed.toFixed(2)}
                </span>
              </div>
            )}
            
            {/* Background enhancement status */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Background Enhanced
              </span>
              <span className={cn(
                "text-sm font-semibold",
                metadata.backgroundEnhanced 
                  ? "text-success dark:text-success" 
                  : "text-slate-500 dark:text-slate-400"
              )}>
                {metadata.backgroundEnhanced ? 'Yes' : 'No'}
              </span>
            </div>
            
            {/* Background upscale factor - Only show if background was enhanced */}
            {metadata.backgroundEnhanced && metadata.bgUpscale > 1 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Background Upscale
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {metadata.bgUpscale}x
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Warning message - Show when there's a warning */}
      {!isProcessing && warning && (
        <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                Warning
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {warning}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

