
import React from 'react';
import { useUpscale } from '@/context/UpscaleContext';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Spinner } from '@/components/ui/Spinner';
import { StreamingPreview } from './StreamingPreview';

export function UploadProgress() {
  const { status, progress, preview } = useUpscale();

  if (status === 'idle' || status === 'error' || status === 'success') {
    return null;
  }

  return (
    <div className="w-full space-y-6 py-8">
      {/* Live region for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {status === 'uploading' && `Đang upload: ${progress}%`}
        {status === 'processing' && `Đang xử lý: ${progress}%`}
      </div>

      {/* Streaming preview với blur effect */}
      {preview && status === 'processing' && (
        <StreamingPreview
          originalImage={preview}
          progress={progress}
          status={status}
          message={
            progress < 30 ? 'Đang tải AI model...' :
            progress < 80 ? 'Đang xử lý ảnh...' :
            progress < 100 ? 'Đang hoàn thiện...' :
            'Hoàn thành!'
          }
        />
      )}

      {/* Upload progress */}
      {status === 'uploading' && (
        <ProgressBar
          progress={progress}
          label="Đang upload"
          showPercentage={true}
        />
      )}

      {/* Processing progress với animation mượt hơn */}
      {status === 'processing' && (
        <div className="space-y-4">
          <ProgressBar
            progress={progress}
            label="Đang nâng cấp ảnh"
            showPercentage={true}
          />
          
          {/* Processing stages */}
          <div className="flex justify-between text-xs text-slate-500">
            <span className={progress >= 10 ? 'text-[#256af0] font-medium' : ''}>
              {progress >= 10 ? '✓' : '○'} Tải model
            </span>
            <span className={progress >= 30 ? 'text-[#256af0] font-medium' : ''}>
              {progress >= 30 ? '✓' : '○'} Xử lý AI
            </span>
            <span className={progress >= 80 ? 'text-[#256af0] font-medium' : ''}>
              {progress >= 80 ? '✓' : '○'} Mã hóa
            </span>
            <span className={progress === 100 ? 'text-[#256af0] font-medium' : ''}>
              {progress === 100 ? '✓' : '○'} Hoàn thành
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
