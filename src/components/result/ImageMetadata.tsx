
import React from 'react';
import { ImageIcon, Maximize, Clock, HardDrive, Sparkles } from 'lucide-react';
import { useUpscale } from '@/context/UpscaleContext';
import { formatResolution, formatFileSize, formatProcessingTime } from '@/lib/utils';
import { RESOLUTION_OPTIONS } from '@/lib/constants';

export function ImageMetadata() {
  const { result, config, file } = useUpscale();

  if (!result || !file) {
    return null;
  }

  const resolutionInfo = RESOLUTION_OPTIONS.find(
    (opt) => opt.value === config.resolution
  );

  // ⚡ Parse resolution strings (format: "WIDTHxHEIGHT")
  const parseResolution = (res: string): { width: number; height: number } => {
    const [width, height] = res.split('x').map(Number);
    return { width: width || 0, height: height || 0 };
  };

  const originalRes = parseResolution(result.originalResolution);
  const upscaledRes = parseResolution(result.upscaledResolution);

  // ⚡ Format detected mode for display
  const formatDetectedMode = (mode: string): string => {
    const modeMap: Record<string, string> = {
      'colorization': 'Tô màu (Grayscale)',
      'inpainting': 'Sửa vùng trắng',
      'upscaling': 'Nâng độ phân giải',
      'restoration': 'Phục hồi chất lượng',
    };
    return modeMap[mode] || mode;
  };

  const metadata = [
    {
      icon: ImageIcon,
      label: 'Độ phân giải gốc',
      value: formatResolution(originalRes.width, originalRes.height),
    },
    {
      icon: Maximize,
      label: 'Độ phân giải mới',
      value: formatResolution(upscaledRes.width, upscaledRes.height),
    },
    {
      icon: HardDrive,
      label: 'Kích thước file',
      value: formatFileSize(result.fileSizeBytes),
    },
    {
      icon: Clock,
      label: 'Thời gian xử lý',
      value: formatProcessingTime(result.processingTimeMs),
    },
  ];

  // ⚡ Add detected mode if available (Smart Auto-Detection)
  if (result.detectedMode) {
    metadata.push({
      icon: Sparkles,
      label: 'AI đã phát hiện',
      value: formatDetectedMode(result.detectedMode),
    });
  }

  return (
    <div className="space-y-4">
      {metadata.map((item) => (
        <div
          key={item.label}
          className="group relative flex items-center gap-4 p-5 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:border-primary/20 dark:hover:border-primary/30 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 dark:group-hover:from-primary/30 dark:group-hover:to-primary/20 transition-all duration-300">
            <item.icon className="w-7 h-7 text-primary dark:text-primary-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{item.label}</p>
            <p className="text-xl font-bold text-indigo-950 dark:text-slate-100 font-heading">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
