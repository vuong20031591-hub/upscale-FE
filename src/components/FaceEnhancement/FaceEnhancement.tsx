
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Download, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/AppButton';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { FaceModeSelector } from './FaceModeSelector';
import { FaceEnhancementPreview } from './FaceEnhancementPreview';
import { enhanceFace } from '@/services/faceEnhancementApi';
import type { FaceMode, FaceEnhancementMetadata } from '@/types/face-enhancement';

/**
 * Processing state for face enhancement workflow.
 */
type ProcessingState = 'idle' | 'processing' | 'success' | 'error';

/**
 * FaceEnhancement Component
 * 
 * Main component cho face enhancement feature. Tích hợp file upload,
 * mode selection, và result preview.
 * 
 * Features:
 * - Drag & drop file upload
 * - File validation (size, type)
 * - Mode selection (restoration/colorization/inpainting)
 * - Parameter configuration (weight, face_upsample)
 * - Before/after preview
 * - Download enhanced image
 * - Error handling với user-friendly messages
 * - Responsive design với dark mode support
 * 
 * @example
 * ```tsx
 * <FaceEnhancement />
 * ```
 * 
 * Requirements: 7.1-7.7
 */
export function FaceEnhancement() {
  // State management
  const [file, setFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null);
  const [enhancedBlob, setEnhancedBlob] = useState<Blob | null>(null);
  const [state, setState] = useState<ProcessingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<FaceEnhancementMetadata | undefined>(undefined);
  
  // Enhancement parameters
  const [mode, setMode] = useState<FaceMode>('restoration');
  const [weight, setWeight] = useState<number>(0.7);
  const [faceUpsample, setFaceUpsample] = useState<boolean>(true);
  const [backgroundEnhance, setBackgroundEnhance] = useState<boolean>(true);
  const [bgUpscale, setBgUpscale] = useState<1 | 2 | 4>(2);

  /**
   * Handle file drop/select
   */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const selectedFile = acceptedFiles[0];
    
    // Validate file size (10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (selectedFile.size > MAX_SIZE) {
      setError('File quá lớn. Kích thước tối đa là 10MB.');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG và PNG.');
      return;
    }

    // Clear previous state
    setError(null);
    setState('idle');
    setEnhancedImageUrl(null);
    setEnhancedBlob(null);
    setMetadata(undefined);

    // Set file and create preview URL
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setOriginalImageUrl(url);
  }, []);

  /**
   * Configure dropzone
   */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    multiple: false,
  });

  /**
   * Remove uploaded file
   */
  const handleRemoveFile = useCallback(() => {
    if (originalImageUrl) {
      URL.revokeObjectURL(originalImageUrl);
    }
    if (enhancedImageUrl) {
      URL.revokeObjectURL(enhancedImageUrl);
    }
    
    setFile(null);
    setOriginalImageUrl(null);
    setEnhancedImageUrl(null);
    setEnhancedBlob(null);
    setState('idle');
    setError(null);
    setMetadata(undefined);
  }, [originalImageUrl, enhancedImageUrl]);

  /**
   * Process image với face enhancement
   */
  const handleEnhance = useCallback(async () => {
    if (!file) return;

    setState('processing');
    setError(null);
    setEnhancedImageUrl(null);
    setEnhancedBlob(null);
    setMetadata(undefined);

    try {
      const result = await enhanceFace(file, {
        mode,
        weight: mode === 'restoration' ? weight : undefined,
        faceUpsample: mode === 'restoration' ? faceUpsample : undefined,
        backgroundEnhance,
        bgUpscale,
      });

      // Create URL for enhanced image
      const url = URL.createObjectURL(result.imageBlob);
      setEnhancedImageUrl(url);
      setEnhancedBlob(result.imageBlob);
      setMetadata(result.metadata);
      setState('success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định';
      setError(errorMessage);
      setState('error');
    }
  }, [file, mode, weight, faceUpsample, backgroundEnhance, bgUpscale]);

  /**
   * Download enhanced image
   */
  const handleDownload = useCallback(() => {
    if (!enhancedBlob || !file) return;

    const url = URL.createObjectURL(enhancedBlob);
    const a = document.createElement('a');
    a.href = url;
    
    // Generate filename: original_name_enhanced_mode.ext
    const originalName = file.name.replace(/\.[^/.]+$/, '');
    const extension = file.name.split('.').pop() || 'png';
    a.download = `${originalName}_enhanced_${mode}.${extension}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [enhancedBlob, file, mode]);

  /**
   * Retry after error
   */
  const handleRetry = useCallback(() => {
    setError(null);
    setState('idle');
  }, []);

  const isProcessing = state === 'processing';
  const hasResult = state === 'success' && enhancedImageUrl;
  const hasError = state === 'error' && error;

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log error to console in development
        console.error('FaceEnhancement Error:', error, errorInfo);
        // TODO: Send to error tracking service in production
      }}
    >
      <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-slate-100">
          Face Enhancement
        </h1>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Enhance facial details, colorize grayscale photos, or fill damaged regions using AI-powered CodeFormer
        </p>
      </div>

      {/* Upload Zone - Only show when no file uploaded */}
      {!file && (
        <div
          {...getRootProps()}
          className={cn(
            'relative rounded-2xl border-2 border-dashed transition-all duration-300 ease-out',
            'p-8 md:p-12 cursor-pointer',
            'glass-card',
            isDragActive
              ? 'border-primary bg-primary/10 dark:bg-primary/20 scale-[1.02]'
              : 'border-slate-300 dark:border-slate-600 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 hover:scale-[1.01]'
          )}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10 dark:bg-primary/20">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {isDragActive ? 'Drop image here' : 'Drag & drop your image here'}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                or click to browse files
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span>JPG, PNG</span>
              <span>•</span>
              <span>Max 10MB</span>
            </div>
          </div>
        </div>
      )}

      {/* File Info - Show when file uploaded */}
      {file && (
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                <Upload className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              disabled={isProcessing}
              leftIcon={<X className="w-4 h-4" />}
              className="flex-shrink-0"
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Mode Selector - Show when file uploaded */}
      {file && (
        <div className="glass-card p-6 rounded-xl">
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
      )}

      {/* Process Button - Show when file uploaded and not processing */}
      {file && !isProcessing && !hasResult && (
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleEnhance}
            className="min-w-[200px]"
          >
            Enhance Faces
          </Button>
        </div>
      )}

      {/* Preview - Show when file uploaded */}
      {file && (
        <div className="glass-card p-6 rounded-xl">
          <FaceEnhancementPreview
            originalImage={originalImageUrl}
            enhancedImage={enhancedImageUrl}
            isProcessing={isProcessing}
            metadata={metadata}
            warning={metadata?.warning}
          />
        </div>
      )}

      {/* Error Message */}
      {hasError && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
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
              onClick={handleRetry}
            >
              Try Again
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
            >
              Upload New Image
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons - Show when has result */}
      {hasResult && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            onClick={handleDownload}
            leftIcon={<Download className="w-5 h-5" />}
            className="min-w-[200px]"
          >
            Download Enhanced
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleRemoveFile}
            className="min-w-[200px]"
          >
            Upload New Image
          </Button>
        </div>
      )}
    </div>
    </ErrorBoundary>
  );
}
