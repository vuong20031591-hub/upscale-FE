
import React, { useEffect } from 'react';
// next/image replaced with native img
import { X, MoveHorizontal, ZoomIn, ZoomOut, Minimize2 } from 'lucide-react';
import { useComparisonSlider } from '@/hooks/useComparisonSlider';
import { useImageZoom } from '@/hooks/useImageZoom';
import { cn } from '@/lib/utils';

interface ImageLightboxProps {
  originalImageUrl: string;
  upscaledImageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function ImageLightbox({ 
  originalImageUrl, 
  upscaledImageUrl, 
  isOpen, 
  onClose, 
  title = 'So sánh ảnh gốc và ảnh đã nâng cấp' 
}: ImageLightboxProps) {
  const {
    position,
    isDragging: isSliderDragging,
    containerRef: sliderContainerRef,
    handleMouseDown: handleSliderMouseDown,
    handleTouchStart: handleSliderTouchStart,
    handleKeyDown,
  } = useComparisonSlider();

  const {
    zoom,
    position: panPosition,
    isDragging: isPanning,
    containerRef: zoomContainerRef,
    zoomIn,
    zoomOut,
    resetZoom,
    handleMouseDown: handlePanMouseDown,
    handleTouchStart: handleZoomTouchStart,
    canZoomIn,
    canZoomOut,
  } = useImageZoom({ minZoom: 1, maxZoom: 5, zoomStep: 0.5 });

  // Close on ESC key and reset zoom when closing
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        resetZoom();
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      resetZoom(); // Reset zoom when lightbox closes
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, resetZoom]);

  if (!isOpen) return null;

  // Combine mouse down handlers - pan only when zoomed
  const handleImageMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      handlePanMouseDown(e);
    }
  };

  // Combine touch handlers
  const handleImageTouchStart = (e: React.TouchEvent) => {
    handleZoomTouchStart(e);
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm',
        'flex items-center justify-center p-4',
        'animate-in fade-in duration-200'
      )}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={() => {
          resetZoom();
          onClose();
        }}
        className="absolute top-6 right-6 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white backdrop-blur-md transition-all hover:scale-110 flex items-center justify-center"
        aria-label="Đóng"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Zoom controls - Top right, below close button */}
      <div className="absolute top-24 right-6 z-20 flex flex-col gap-3">
        {/* Zoom In */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            zoomIn();
          }}
          disabled={!canZoomIn}
          className={cn(
            'w-11 h-11 rounded-full backdrop-blur-md transition-all flex items-center justify-center',
            canZoomIn
              ? 'bg-black/40 hover:bg-black/60 border border-white/20 text-white hover:scale-110'
              : 'bg-black/20 border border-white/10 text-white/30 cursor-not-allowed'
          )}
          aria-label="Phóng to"
          title="Phóng to (Ctrl + cuộn chuột)"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        {/* Zoom percentage */}
        <div className="w-11 h-11 rounded-full bg-black/40 border border-white/20 text-white text-xs font-bold backdrop-blur-md flex items-center justify-center">
          {Math.round(zoom * 100)}%
        </div>

        {/* Zoom Out */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            zoomOut();
          }}
          disabled={!canZoomOut}
          className={cn(
            'w-11 h-11 rounded-full backdrop-blur-md transition-all flex items-center justify-center',
            canZoomOut
              ? 'bg-black/40 hover:bg-black/60 border border-white/20 text-white hover:scale-110'
              : 'bg-black/20 border border-white/10 text-white/30 cursor-not-allowed'
          )}
          aria-label="Thu nhỏ"
          title="Thu nhỏ (Ctrl + cuộn chuột)"
        >
          <ZoomOut className="w-5 h-5" />
        </button>

        {/* Reset zoom */}
        {zoom > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetZoom();
            }}
            className="w-11 h-11 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] border border-purple-400/30 text-white backdrop-blur-md transition-all hover:scale-110 shadow-lg shadow-purple-500/30 flex items-center justify-center"
            aria-label="Đặt lại zoom"
            title="Đặt lại về 100%"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Title */}
      <div className="absolute top-6 left-6 z-10 px-5 py-2.5 rounded-full bg-black/40 border border-white/20 text-white backdrop-blur-md">
        <span className="text-sm font-semibold">{title}</span>
      </div>

      {/* Comparison Slider Container with Zoom */}
      <div
        className="relative w-[95vw] h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={zoomContainerRef}
          className={cn(
            'relative w-full h-full rounded-2xl overflow-hidden bg-slate-900',
            zoom > 1 ? 'cursor-move' : 'cursor-default'
          )}
          onMouseDown={handleImageMouseDown}
          onTouchStart={handleImageTouchStart}
          style={{
            transform: `scale(${zoom}) translate(${panPosition.x / zoom}px, ${panPosition.y / zoom}px)`,
            transition: isPanning ? 'none' : 'transform 0.2s ease-out',
          }}
        >
          <div
            ref={sliderContainerRef}
            className="relative w-full h-full select-none"
            onMouseDown={zoom === 1 ? handleSliderMouseDown : undefined}
            onTouchStart={zoom === 1 ? handleSliderTouchStart : undefined}
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
            <Image
              src={originalImageUrl}
              alt="Original image"
              fill
              className="object-contain"
              sizes="95vw"
              quality={100}
              priority
              draggable={false}
            />

            {/* After image (upscaled) - clipped */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              <Image
                src={upscaledImageUrl}
                alt="Upscaled image"
                fill
                className="object-contain"
                sizes="95vw"
                quality={100}
                priority
                draggable={false}
              />
            </div>

            {/* Slider divider line - only show when not zoomed */}
            {zoom === 1 && (
              <>
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
                  style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                >
                  {/* Slider handle */}
                  <div
                    className={cn(
                      'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                      'w-14 h-14 rounded-full bg-white shadow-2xl',
                      'flex items-center justify-center',
                      'transition-transform duration-150',
                      isSliderDragging && 'scale-110'
                    )}
                  >
                    <MoveHorizontal className="w-6 h-6 text-slate-600" />
                  </div>
                </div>

                {/* Labels */}
                <span className="absolute top-6 left-6 px-5 py-2.5 rounded-full bg-black/70 text-white text-base font-semibold backdrop-blur-sm">
                  Gốc
                </span>
                <span className="absolute top-6 right-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-600 text-white text-base font-semibold backdrop-blur-sm shadow-lg shadow-primary/30">
                  Đã nâng cấp
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-black/40 border border-white/20 text-white text-sm backdrop-blur-md text-center max-w-2xl">
        {zoom === 1 
          ? 'Kéo thanh trượt để so sánh • Ctrl + cuộn chuột để zoom • Nhấn ESC để đóng'
          : 'Kéo để di chuyển ảnh • Ctrl + cuộn chuột để zoom • Nhấn ESC để đóng'
        }
      </div>
    </div>
  );
}
