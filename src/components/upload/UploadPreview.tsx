
import React from 'react';
// next/image replaced with native img
import { X, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUpscale } from '@/context/UpscaleContext';
import { Button } from '@/components/ui/Button';

export function UploadPreview() {
  const { preview, file, setFile, status } = useUpscale();

  const handleRemove = () => {
    setFile(null);
  };

  // Show placeholder if no preview
  if (!preview) {
    return (
      <div className="w-full aspect-video max-h-[400px] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-6">
        <ImageIcon className="w-12 h-12 text-slate-300 mb-4" />
        <p className="text-slate-500 font-medium">Chưa có ảnh nào được chọn</p>
        <p className="text-slate-400 text-sm mt-1">Upload ảnh để bắt đầu xử lý</p>
      </div>
    );
  }

  const isProcessing = status === 'uploading' || status === 'processing';

  return (
    <div className="relative w-full aspect-video max-h-[400px] rounded-xl overflow-hidden bg-slate-900 group">
      {/* Image preview */}
      <Image
        src={preview}
        alt={file?.name || 'Preview'}
        fill
        className={cn(
          'object-contain transition-opacity duration-300',
          isProcessing && 'opacity-50'
        )}
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />

      {/* Remove button */}
      {!isProcessing && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="absolute top-3 right-3 bg-black/50 text-white hover:bg-black/70 hover:text-white border-0"
          leftIcon={<X className="w-4 h-4" />}
          aria-label="Remove image"
        >
          Xóa
        </Button>
      )}

      {/* File info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <p className="text-white text-sm font-medium truncate">
          {file?.name}
        </p>
        {file?.size && (
          <p className="text-white/70 text-xs">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </div>
    </div>
  );
}
