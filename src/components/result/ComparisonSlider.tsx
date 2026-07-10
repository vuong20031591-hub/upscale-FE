
import React, { useState } from 'react';
// next/image replaced with native img
import { MoveHorizontal, Maximize2 } from 'lucide-react';
import { useComparisonSlider } from '@/hooks/useComparisonSlider';
import { useUpscale } from '@/context/UpscaleContext';
import { ImageLightbox } from './ImageLightbox';
import { cn } from '@/lib/utils';

export function ComparisonSlider() {
  const { preview, result } = useUpscale();
  const {
    position,
    isDragging,
    containerRef,
    handleMouseDown,
    handleTouchStart,
    handleKeyDown,
  } = useComparisonSlider();

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!preview || !result) {
    return null;
  }

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden bg-slate-900 select-none group"
        style={{ aspectRatio: '21/9', minHeight: '500px' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-label="Image comparison slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)}% showing enhanced image`}
      >
        {/* Before image (original) - full width */}
        <img
          src={preview}
          alt="Original image"
          className="object-contain"
          draggable={false}
        />

        {/* After image (upscaled) - clipped */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={result.imageUrl}
            alt="Upscaled image"
            className="object-contain"
            draggable={false}
          />
        </div>

        {/* Zoom button - Bottom right corner */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute bottom-6 right-6 p-3 rounded-full bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white backdrop-blur-sm transition-all hover:scale-110 shadow-lg shadow-primary/30 z-10"
          aria-label="Phóng to ảnh"
          title="Xem ảnh toàn màn hình"
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        {/* Slider divider line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          {/* Slider handle */}
          <div
            className={cn(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'w-12 h-12 rounded-full bg-white shadow-lg',
              'flex items-center justify-center',
              'transition-transform duration-150',
              isDragging && 'scale-110'
            )}
          >
            <MoveHorizontal className="w-5 h-5 text-slate-600" />
          </div>
        </div>

        {/* Labels - Larger */}
        <span className="absolute top-6 left-6 px-4 py-2 rounded-full bg-black/60 dark:bg-slate-800/80 text-white text-sm font-semibold backdrop-blur-sm">
          Gốc
        </span>
        <span className="absolute top-6 right-6 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white text-sm font-semibold backdrop-blur-sm shadow-lg shadow-primary/30">
          Đã nâng cấp
        </span>

        {/* Instructions - Larger */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-black/60 dark:bg-slate-800/80 text-white text-sm backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity">
          Kéo để so sánh • Dùng phím ← → để điều chỉnh
        </div>
      </div>

      {/* Lightbox modal */}
      <ImageLightbox
        originalImageUrl={preview}
        upscaledImageUrl={result.imageUrl}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        title="So sánh ảnh gốc và ảnh đã nâng cấp"
      />
    </>
  );
}
