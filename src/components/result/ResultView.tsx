
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ComparisonSlider } from './ComparisonSlider';
import { ImageMetadata } from './ImageMetadata';
import { DownloadButton } from './DownloadButton';
import { useUpscale } from '@/context/UpscaleContext';

export function ResultView() {
  const { status, result, reset } = useUpscale();

  // Only show when processing is complete
  if (status !== 'success' || !result) {
    return null;
  }

  return (
    <div className="glass-card rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-indigo-950 dark:text-slate-100 font-heading">
            Kết quả
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-1">
            Ảnh của bạn đã được nâng cấp thành công
          </p>
        </div>

        <div className="flex gap-3">
          <DownloadButton />
          <Button 
            variant="outline" 
            onClick={reset}
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
          <ComparisonSlider />
        </div>

        {/* Metadata - 2/5 width (rộng hơn) */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-indigo-950 dark:text-slate-100 font-heading">Thông tin chi tiết</h3>
          <ImageMetadata />
        </div>
      </div>
    </div>
  );
}
