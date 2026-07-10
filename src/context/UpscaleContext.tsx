
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type {
  UpscaleConfig,
  UpscaleResult,
  UpscaleStatus,
  Resolution,
} from '@/types';
import { useStreamingUpload } from '@/hooks/useStreamingUpload';
import { useToast } from '@/hooks/useToast';
import { DEFAULT_CONFIG } from '@/lib/constants';

interface UpscaleContextValue {
  // State
  file: File | null;
  preview: string | null;
  progress: number;
  status: UpscaleStatus;
  error: string | null;
  result: UpscaleResult | null;
  config: UpscaleConfig;
  message: string;

  // Actions
  setFile: (file: File | null) => void;
  setConfig: (config: Partial<UpscaleConfig>) => void;
  setResolution: (resolution: Resolution) => void;
  upload: () => Promise<void>;
  reset: () => void;

  // Toast
  toasts: ReturnType<typeof useToast>['toasts'];
  removeToast: ReturnType<typeof useToast>['removeToast'];
}

const UpscaleContext = createContext<UpscaleContextValue | null>(null);

export function useUpscale() {
  const context = useContext(UpscaleContext);
  if (!context) {
    throw new Error('useUpscale must be used within UpscaleProvider');
  }
  return context;
}

interface UpscaleProviderProps {
  children: React.ReactNode;
}

export function UpscaleProvider({ children }: UpscaleProviderProps) {
  const [config, setConfigState] = useState<UpscaleConfig>(DEFAULT_CONFIG);
  const [file, setFileState] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // ⚡ Sửa: Dùng ref để lưu file state mới nhất, tránh stale closure
  const fileRef = React.useRef<File | null>(null);

  const {
    progress,
    status: streamStatus,
    message,
    result,
    error,
    upload: uploadStreaming,
    cancel,
    resetResult, // ⚡ Sửa: Destructure resetResult
  } = useStreamingUpload();

  const { toasts, removeToast, error: showError } = useToast();

  // Map streaming status to UpscaleStatus
  const status: UpscaleStatus = useMemo(() => {
    if (streamStatus === 'queued' || streamStatus === 'loading') return 'uploading';
    if (streamStatus === 'processing' || streamStatus === 'encoding') return 'processing';
    if (streamStatus === 'complete') return result ? 'success' : 'idle'; // Only 'success' if has result
    if (streamStatus === 'error') return 'error';
    return 'idle';
  }, [streamStatus, result]);

  // Update config
  const setConfig = useCallback((partialConfig: Partial<UpscaleConfig>) => {
    setConfigState((prev) => ({ ...prev, ...partialConfig }));
  }, []);

  const setResolution = useCallback(
    (resolution: Resolution) => {
      setConfig({ resolution });
    },
    [setConfig]
  );

  // Set file and create preview
  const setFile = useCallback((newFile: File | null) => {
    // Revoke old preview URL
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFileState(newFile);
    fileRef.current = newFile; // ⚡ Sửa: Cập nhật ref để upload() luôn dùng file mới nhất

    if (newFile) {
      const previewUrl = URL.createObjectURL(newFile);
      setPreview(previewUrl);
      resetResult(); // ⚡ Sửa: Reset result khi chọn ảnh mới để ẩn ResultView
    } else {
      setPreview(null);
    }
  }, [preview, resetResult]);

  // Upload with current file and config
  const upload = useCallback(async () => {
    // ⚡ Sửa: Dùng fileRef.current thay vì file từ closure để tránh stale state
    const currentFile = fileRef.current;
    
    if (!currentFile) {
      showError('Please select an image first');
      return;
    }

    await uploadStreaming(currentFile, config);
  }, [config, uploadStreaming, showError]);

  // Reset all state
  const reset = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFileState(null);
    fileRef.current = null; // ⚡ Sửa: Reset ref cùng với state
    setPreview(null);
    setConfigState(DEFAULT_CONFIG);
    cancel();
    resetResult(); // ⚡ Sửa: Reset result để ẩn ResultView khi click "Xử lý ảnh khác"
  }, [preview, cancel, resetResult]);

  // Show error toast when error changes
  React.useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const value = useMemo(
    () => ({
      file,
      preview,
      progress,
      status,
      error,
      result,
      config,
      message,
      setFile,
      setConfig,
      setResolution,
      upload,
      reset,
      toasts,
      removeToast,
    }),
    [
      file,
      preview,
      progress,
      status,
      error,
      result,
      config,
      message,
      setFile,
      setConfig,
      setResolution,
      upload,
      reset,
      toasts,
      removeToast,
    ]
  );

  return (
    <UpscaleContext.Provider value={value}>{children}</UpscaleContext.Provider>
  );
}
