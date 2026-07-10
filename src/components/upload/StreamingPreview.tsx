// Component: Hiển thị preview blur → sharp

import React, { useState, useEffect } from 'react';
// next/image replaced with native img
import { cn } from '@/lib/utils';

interface StreamingPreviewProps {
  originalImage: string;
  progress: number;
  status: string;
  message?: string;
}

export function StreamingPreview({ 
  originalImage, 
  progress, 
  status,
  message 
}: StreamingPreviewProps) {
  const [blurAmount, setBlurAmount] = useState(20);

  // Giảm blur dần theo progress
  useEffect(() => {
    // Blur từ 20px → 0px khi progress 0% → 100%
    const newBlur = Math.max(0, 20 - (progress / 100) * 20);
    setBlurAmount(newBlur);
  }, [progress]);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900">
      {/* Original image với blur effect */}
      <Image
        src={originalImage}
        alt="Processing preview"
        fill
        className={cn(
          "object-contain transition-all duration-500",
          status === 'processing' && "animate-pulse"
        )}
        style={{
          filter: `blur(${blurAmount}px)`,
        }}
        sizes="(max-width: 768px) 100vw, 80vw"
        priority
      />

      {/* Overlay với progress info */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="text-center space-y-3 px-6">
          <div className="text-white text-4xl font-bold tabular-nums">
            {progress}%
          </div>
          <div className="text-white/90 text-base font-medium">
            {message || 'Đang xử lý...'}
          </div>
        </div>
      </div>

      {/* Shimmer effect */}
      {status === 'processing' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-translate" />
      )}
    </div>
  );
}
