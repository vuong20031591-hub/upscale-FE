
import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUpscale } from '@/context/UpscaleContext';
import { downloadImage } from '@/lib/api';

export function DownloadButton() {
  const { result, file } = useUpscale();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  if (!result || !file) {
    return null;
  }

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Generate filename
      const originalName = file.name.replace(/\.[^/.]+$/, '');
      const filename = `${originalName}_upscaled.png`;

      await downloadImage(result.imageUrl, filename);

      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 3000);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      isLoading={isDownloading}
      size="lg"
      variant={isDownloaded ? 'secondary' : 'primary'}
      leftIcon={
        isDownloaded ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5" />
      }
    >
      {isDownloaded ? 'Đã tảI xuống' : 'Tải ảnh đã nâng cấp'}
    </Button>
  );
}
