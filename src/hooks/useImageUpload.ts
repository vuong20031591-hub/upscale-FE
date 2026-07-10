
import { useState, useCallback, useRef, useEffect } from 'react';
import type { UpscaleConfig, UpscaleResult, UpscaleStatus } from '@/types';
import { upscaleImage } from '@/lib/api';
import {
  createPreviewUrl,
  revokePreviewUrl,
  isValidFileType,
  isValidFileSize,
} from '@/lib/utils';
import { MAX_FILE_SIZE } from '@/lib/constants';

export interface UseImageUploadReturn {
  file: File | null;
  preview: string | null;
  progress: number;
  status: UpscaleStatus;
  error: string | null;
  result: UpscaleResult | null;
  upload: (file: File, config: UpscaleConfig) => Promise<void>;
  reset: () => void;
  setFile: (file: File | null) => void;
  validateFile: (file: File) => string | null;
}

export function useImageUpload(): UseImageUploadReturn {
  const [file, setFileState] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<UpscaleStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UpscaleResult | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      revokePreviewUrl(preview);
    };
  }, [preview]);

  // Validate file (FR-UP-002, FR-UP-003)
  const validateFile = useCallback((file: File): string | null => {
    if (!isValidFileType(file)) {
      return 'Invalid file type. Please upload JPG or PNG';
    }
    if (!isValidFileSize(file, MAX_FILE_SIZE)) {
      return 'File too large. Maximum size: 10 MB';
    }
    return null;
  }, []);

  // Set file with preview
  const setFile = useCallback((newFile: File | null) => {
    // Cleanup old preview
    setPreview((prev) => {
      revokePreviewUrl(prev);
      return null;
    });

    if (newFile) {
      const validationError = validateFile(newFile);
      if (validationError) {
        setError(validationError);
        setStatus('error');
        return;
      }

      setFileState(newFile);
      setPreview(createPreviewUrl(newFile));
      setStatus('idle');
      setError(null);
    } else {
      setFileState(null);
      setStatus('idle');
      setError(null);
    }
  }, [validateFile]);

  // Upload file (FR-ST-001 to FR-ST-007)
  const upload = useCallback(
    async (uploadFile: File, config: UpscaleConfig) => {
      // Validate before upload
      const validationError = validateFile(uploadFile);
      if (validationError) {
        setError(validationError);
        setStatus('error');
        return;
      }

      // Transition to uploading state
      setStatus('uploading');
      setProgress(0);
      setError(null);

      try {
        // Upload with progress tracking
        const upscaleResult = await upscaleImage(
          uploadFile,
          config,
          (progressValue) => {
            setProgress(progressValue);
          }
        );

        // Transition to processing state
        setStatus('processing');

        // Simulate processing delay or wait for actual processing
        // In the current implementation, the server handles processing synchronously
        // So we transition directly to success

        // Transition to success state
        setResult(upscaleResult);
        setStatus('success');
        setProgress(100);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        setStatus('error');
      }
    },
    [validateFile]
  );

  // Reset state (FR-ER-005)
  const reset = useCallback(() => {
    // Cleanup preview
    setPreview((prev) => {
      revokePreviewUrl(prev);
      return null;
    });

    setFileState(null);
    setProgress(0);
    setStatus('idle');
    setError(null);
    setResult(null);

    // Abort any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    file,
    preview,
    progress,
    status,
    error,
    result,
    upload,
    reset,
    setFile,
    validateFile,
  };
}
