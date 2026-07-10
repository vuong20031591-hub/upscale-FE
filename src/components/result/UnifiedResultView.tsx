
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import { ComparisonSlider } from './ComparisonSlider';
import { ImageMetadata } from './ImageMetadata';
import { DownloadButton } from './DownloadButton';
import type { UpscaleResult } from '@/types';

interface UnifiedResultViewProps {
  /** URL của ảnh gốc */
  originalImageUrl: string;
  
  /** Result data (upscale hoặc face enhancement đã được adapt) */
  result: UpscaleResult;
  
  /** File gốc (để download) */
  originalFile: File | null;
  
  /** Callback khi click "Xử lý ảnh khác" */
  onReset: () => void;
  
  /** Callback khi click download */
  onDownload: () => void;
  
  /** Title tùy chỉnh (optional) */
  title?: string;
  
  /** Subtitle tùy chỉnh (optional) */
  subtitle?: string;
  
  /** Custom metadata items (optional) */
  customMetadata?: Array<{
    icon: React.ElementType;
    label: string;
    value: string;
  }>;
}

/**
 * UnifiedResultView Component
 * 
 * Component hiển thị kết quả dùng chung cho cả Upscale và Face Enhancement.
 * Nhận data từ props thay vì context để có thể reuse.
 * 
 * Features:
 * - Comparison slider
 * - Image metadata
 * - Download button
 * - Reset button
 * - Customizable title/subtitle
 * - Custom metadata items
 */
export function UnifiedResultView({
  originalImageUrl,
  result,
  originalFile,
  onReset,
  onDownload,
  title = 'Kết quả',
  subtitle = 'Ảnh của bạn đã được xử lý thành công',
  customMetadata,
}: UnifiedResultViewProps) {
  return (
    <div className="glass-card rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-indigo-950 dark:text-slate-100 font-heading">
            {title}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-1">
            {subtitle}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onDownload}
            className="shadow-glow-purple"
          >
            Tải xuống
          </Button>
          <Button 
            variant="outline" 
            onClick={onReset}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Xử lý ảnh khác
          </Button>
        </div>
      </div>

      {/* Bố cục ngang: Comparison Slider (trái) + Metadata (phải) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Comparison Slider - 3/5 width */}
        <div className="lg:col-span-3">
          <ComparisonSliderStandalone
            originalImageUrl={originalImageUrl}
            processedImageUrl={result.imageUrl}
          />
        </div>

        {/* Metadata - 2/5 width */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-indigo-950 dark:text-slate-100 font-heading">
            Thông tin chi tiết
          </h3>
          
          {customMetadata ? (
            <div className="space-y-4">
              {customMetadata.map((item) => (
                <div
                  key={item.label}
                  className="group relative flex items-center gap-4 p-5 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:border-primary/20 dark:hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 dark:group-hover:from-primary/30 dark:group-hover:to-primary/20 transition-all duration-300">
                    <item.icon className="w-7 h-7 text-primary dark:text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      {item.label}
                    </p>
                    <p className="text-xl font-bold text-indigo-950 dark:text-slate-100 font-heading">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ImageMetadataStandalone
              result={result}
              originalFile={originalFile}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Standalone ComparisonSlider không dùng context
 */
function ComparisonSliderStandalone({
  originalImageUrl,
  processedImageUrl,
}: {
  originalImageUrl: string;
  processedImageUrl: string;
}) {
  const [position, setPosition] = React.useState(50);
  const [isDragging, setIsDragging] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMove = React.useCallback((clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percentage);
  }, []);

  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  }, [handleMove]);

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  }, [isDragging, handleMove]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden bg-slate-900 select-none group cursor-ew-resize"
      style={{ aspectRatio: '21/9', minHeight: '500px' }}
      onMouseDown={handleMouseDown}
    >
      {/* Before image */}
      <img
        src={originalImageUrl}
        alt="Original"
        className="absolute inset-0 w-full h-full object-contain"
        draggable={false}
      />

      {/* After image - clipped */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={processedImageUrl}
          alt="Processed"
          className="absolute inset-0 w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Slider divider */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-6 left-6 px-4 py-2 rounded-full bg-black/60 text-white text-sm font-semibold backdrop-blur-sm">
        Gốc
      </span>
      <span className="absolute top-6 right-6 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-primary-600 text-white text-sm font-semibold backdrop-blur-sm shadow-lg shadow-primary/30">
        Đã xử lý
      </span>
    </div>
  );
}

/**
 * Standalone ImageMetadata không dùng context
 */
function ImageMetadataStandalone({
  result,
  originalFile,
}: {
  result: UpscaleResult;
  originalFile: File | null;
}) {
  const metadata = [
    {
      icon: () => (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Độ phân giải gốc',
      value: result.originalResolution,
    },
    {
      icon: () => (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      ),
      label: 'Độ phân giải mới',
      value: result.upscaledResolution,
    },
    {
      icon: () => (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
      label: 'Kích thước file',
      value: `${(result.fileSizeBytes / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      icon: () => (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Thời gian xử lý',
      value: `${(result.processingTimeMs / 1000).toFixed(1)}s`,
    },
  ];

  return (
    <div className="space-y-4">
      {metadata.map((item) => (
        <div
          key={item.label}
          className="group relative flex items-center gap-4 p-5 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:border-primary/20 dark:hover:border-primary/30 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 dark:group-hover:from-primary/30 dark:group-hover:to-primary/20 transition-all duration-300">
            <item.icon />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
              {item.label}
            </p>
            <p className="text-xl font-bold text-indigo-950 dark:text-slate-100 font-heading">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
