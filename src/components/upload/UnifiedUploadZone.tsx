
import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '@/lib/constants';
import type { TabValue } from '@/components/ui/AppTabSwitcher';

interface UnifiedUploadZoneProps {
  activeTab: TabValue;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  error?: string | null;
}

/**
 * UnifiedUploadZone Component
 * 
 * Upload zone dùng chung cho cả Image Upscaling và Face Enhancement.
 * Hiển thị UI khác nhau dựa trên activeTab.
 * 
 * Features:
 * - Drag & drop
 * - Click to browse
 * - Paste (Ctrl+V)
 * - Sample images
 * - Scale selector (chỉ cho upscale tab)
 * - Responsive design
 * - Dark mode support
 */
export function UnifiedUploadZone({ 
  activeTab, 
  onFileSelect, 
  disabled = false,
  error = null 
}: UnifiedUploadZoneProps) {
  const [activeScale, setActiveScale] = React.useState<'2x' | '4x'>('2x');
  const [isHovered, setIsHovered] = React.useState(false);

  const isUpscaleTab = activeTab === 'upscale';
  const isFaceTab = activeTab === 'face-enhancement';

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  // Handler for sample image clicks
  const handleSampleClick = useCallback(
    async (e: React.MouseEvent, src: string) => {
      e.stopPropagation();
      
      if (disabled) return;

      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error('Failed to load sample image');

        const blob = await response.blob();
        const fileName = src.split('/').pop() || 'sample.jpg';
        const file = new File([blob], fileName, {
          type: blob.type || 'image/jpeg',
        });

        onFileSelect(file);
      } catch (err) {
        console.error('Error loading sample image:', err);
      }
    },
    [onFileSelect, disabled]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    open,
  } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled,
    noClick: true,
  });

  // Paste handler
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (disabled) return;

      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            onFileSelect(file);
            break;
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [onFileSelect, disabled]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Outer container */}
      <div
        className={cn(
          'relative w-full transition-all duration-300',
          'border-[2.5px] border-primary/30 dark:border-primary/40',
          'rounded-[44px]',
          'bg-gradient-to-br from-[#F3F0FE] to-[#F6F9FE]',
          'dark:from-slate-800 dark:to-slate-900',
          'p-3'
        )}
        style={{ overflow: 'hidden' }}
      >
        {/* Inner dashed container */}
        <div
          {...getRootProps()}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => !disabled && setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Upload image by dragging and dropping or pressing Enter"
          data-drag-active={isDragActive}
          className={cn(
            'relative w-full min-h-[200px] rounded-[32px]',
            'transition-all duration-300 ease-out cursor-pointer',
            'flex flex-col items-center justify-center p-6 text-center',
            'focus:outline-none focus:ring-4 focus:ring-primary/20',
            isDragActive && 'bg-primary/5 dark:bg-primary/10',
            isDragReject && 'bg-red-50/50 dark:bg-red-900/20',
            error && !isDragActive && 'bg-red-50/30 dark:bg-red-900/10',
            disabled && 'opacity-60 cursor-not-allowed'
          )}
          onClick={() => !disabled && open()}
        >
          {/* Animated SVG Border */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ borderRadius: '32px' }}
          >
            <rect
              x="1.5"
              y="1.5"
              width="calc(100% - 3px)"
              height="calc(100% - 3px)"
              rx="32"
              ry="32"
              fill="none"
              stroke={
                isDragActive
                  ? '#7C3AED'
                  : isDragReject || error
                  ? '#F87171'
                  : isHovered
                  ? '#7C3AED'
                  : 'rgba(124, 58, 237, 0.25)'
              }
              strokeWidth="3"
              strokeDasharray="10 12"
              strokeLinecap="round"
              className={cn(
                'transition-all duration-300',
                isHovered && !disabled && 'svg-border-animate'
              )}
            />
          </svg>

          <input {...getInputProps()} />

          {/* Content */}
          <div className="flex flex-col items-center gap-3 relative z-10">
            {/* Main Button */}
            <button
              type="button"
              disabled={disabled}
              className={cn(
                "px-4 py-3 rounded-xl font-normal transition-all duration-200",
                "bg-primary text-white",
                "dark:bg-primary-600 dark:hover:bg-primary-700",
                "text-base",
                !disabled && "hover:opacity-90",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {isDragActive ? 'Thả ảnh vào đây' : 'Tải ảnh lên'}
            </button>

            {/* Subtitle - Different text based on tab */}
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
              {isUpscaleTab && 'Nâng cấp ảnh lên 2K/4K với AI'}
              {isFaceTab && 'Cải thiện khuôn mặt với CodeFormer AI'}
            </p>

            {/* Instructions */}
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Kéo và thả tệp / {' '}
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                Ctrl + V
              </kbd>
              {' '} để dán hình ảnh
            </p>

            {/* Decorative stars */}
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-primary/40 dark:text-primary/50" />
              <Sparkles className="w-5 h-5 text-primary/60 dark:text-primary/70" />
              <Sparkles className="w-4 h-4 text-primary/40 dark:text-primary/50" />
            </div>

            {/* Sample images section */}
            <div className="mt-1">
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
                Không có ảnh? Hãy dùng thử ảnh
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleSampleClick(e, '/samples/sample1.jpg')}
                  disabled={disabled}
                  className={cn(
                    "w-12 h-12 rounded overflow-hidden transition-opacity",
                    !disabled && "hover:opacity-80 cursor-pointer",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <img
                    src="/samples/sample1.jpg"
                    alt="Sample 1"
                    className="w-full h-full object-cover"
                  />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSampleClick(e, '/samples/sample2.jpg')}
                  disabled={disabled}
                  className={cn(
                    "w-12 h-12 rounded overflow-hidden transition-opacity",
                    !disabled && "hover:opacity-80 cursor-pointer",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <img
                    src="/samples/sample2.jpg"
                    alt="Sample 2"
                    className="w-full h-full object-cover"
                  />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSampleClick(e, '/samples/sample3.jpg')}
                  disabled={disabled}
                  className={cn(
                    "w-12 h-12 rounded overflow-hidden transition-opacity",
                    !disabled && "hover:opacity-80 cursor-pointer",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <img
                    src="/samples/sample3.jpg"
                    alt="Sample 3"
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 2X / 4X badges - Only show for upscale tab */}
          {isUpscaleTab && (
            <div className="absolute bottom-4 right-4 z-20">
              <div className="flex items-center bg-slate-200 dark:bg-slate-700 p-[3px] border border-slate-300 dark:border-slate-600 rounded-[44px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveScale('2x');
                  }}
                  disabled={disabled}
                  className={cn(
                    "px-4 py-1 rounded-[24px] text-slate-900 dark:text-slate-100 text-base font-semibold transition-all",
                    activeScale === '2x' ? "bg-white dark:bg-slate-800 shadow-sm" : "bg-transparent",
                    !disabled && "hover:opacity-80 cursor-pointer",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  2X
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveScale('4x');
                  }}
                  disabled={disabled}
                  className={cn(
                    "px-4 py-1 rounded-[24px] text-slate-900 dark:text-slate-100 text-base font-semibold transition-all",
                    activeScale === '4x' ? "bg-white dark:bg-slate-800 shadow-sm" : "bg-transparent",
                    !disabled && "hover:opacity-80 cursor-pointer",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  4X
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
}
