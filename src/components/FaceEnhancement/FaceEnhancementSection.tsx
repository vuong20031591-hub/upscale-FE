
import React from 'react';
import { AlertCircle, Sparkles, Users, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FaceModeSelector } from './FaceModeSelector';
import { UnifiedResultView } from '@/components/result/UnifiedResultView';
import { useFaceEnhancement } from '@/context/FaceEnhancementContext';
import { adaptFaceEnhancementToUpscaleResult, formatModeName } from '@/utils/faceEnhancementAdapter';

/**
 * FaceEnhancementSection Component
 * 
 * Section hiển thị trong Hero khi tab Face Enhancement được chọn.
 * Sử dụng FaceEnhancementContext để quản lý state.
 * 
 * Features:
 * - Mode selector (restoration/colorization/inpainting)
 * - Parameter configuration
 * - Before/after preview
 * - Enhance và Download buttons
 * - Error handling
 */
export function FaceEnhancementSection() {
  const {
    file,
    status,
    error,
    metadata,
    enhancedImageUrl,
    enhancedBlob,
    originalImageUrl,
    mode,
    weight,
    faceUpsample,
    backgroundEnhance,
    bgUpscale,
    setMode,
    setWeight,
    setFaceUpsample,
    setBackgroundEnhance,
    setBgUpscale,
    enhance,
    download,
    reset,
  } = useFaceEnhancement();

  const isProcessing = status === 'processing';
  const hasResult = status === 'success' && enhancedImageUrl && enhancedBlob && metadata;
  const hasError = status === 'error' && error;

  // Nếu chưa có file, không hiển thị gì (UploadZone sẽ hiển thị)
  if (!file) {
    return null;
  }

  // Nếu đã có result, hiển thị UnifiedResultView
  if (hasResult && originalImageUrl && enhancedImageUrl && enhancedBlob && metadata) {
    // Adapt face enhancement data sang upscale result format
    const adaptedResult = adaptFaceEnhancementToUpscaleResult(
      metadata,
      originalImageUrl,
      enhancedImageUrl,
      enhancedBlob.size
    );

    // Custom metadata cho face enhancement
    const customMetadata = [
      {
        icon: Sparkles,
        label: 'Enhancement Mode',
        value: formatModeName(metadata.modeUsed),
      },
      {
        icon: Users,
        label: 'Faces Detected',
        value: metadata.facesDetected.toString(),
      },
      {
        icon: Clock,
        label: 'Processing Time',
        value: `${metadata.processingTime.toFixed(1)}s`,
      },
      {
        icon: Zap,
        label: 'Background Enhanced',
        value: metadata.backgroundEnhanced ? `Yes (${metadata.bgUpscale}x)` : 'No',
      },
    ];

    return (
      <UnifiedResultView
        originalImageUrl={originalImageUrl}
        result={adaptedResult}
        originalFile={file}
        onReset={reset}
        onDownload={download}
        title="Face Enhancement Complete"
        subtitle={`Successfully enhanced ${metadata.facesDetected} face${metadata.facesDetected !== 1 ? 's' : ''} using ${formatModeName(metadata.modeUsed)} mode`}
        customMetadata={customMetadata}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="glass-card p-6 rounded-2xl">
        <FaceModeSelector
          mode={mode}
          onModeChange={setMode}
          weight={weight}
          onWeightChange={setWeight}
          faceUpsample={faceUpsample}
          onFaceUpsampleChange={setFaceUpsample}
          backgroundEnhance={backgroundEnhance}
          onBackgroundEnhanceChange={setBackgroundEnhance}
          bgUpscale={bgUpscale}
          onBgUpscaleChange={setBgUpscale}
          disabled={isProcessing}
        />
      </div>

      {/* Enhance Button - Show khi chưa processing */}
      {!isProcessing && (
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={enhance}
            className="min-w-[200px] shadow-glow-purple"
          >
            Enhance Faces
          </Button>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="glass-card p-8 rounded-2xl">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Enhancing faces...
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                This may take a few seconds
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {hasError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">
                Processing Failed
              </h4>
              <p className="text-sm text-red-800 dark:text-red-200">
                {error}
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={enhance}
            >
              Try Again
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
            >
              Upload New Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
