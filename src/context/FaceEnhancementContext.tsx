
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { enhanceFace } from '@/services/faceEnhancementApi';
import type { 
  FaceMode, 
  FaceEnhancementMetadata 
} from '@/types/face-enhancement';

type ProcessingStatus = 'idle' | 'processing' | 'success' | 'error';

interface FaceEnhancementContextValue {
  // File state
  file: File | null;
  originalImageUrl: string | null;
  enhancedImageUrl: string | null;
  enhancedBlob: Blob | null;
  
  // Processing state
  status: ProcessingStatus;
  error: string | null;
  metadata: FaceEnhancementMetadata | undefined;
  
  // Parameters
  mode: FaceMode;
  weight: number;
  faceUpsample: boolean;
  backgroundEnhance: boolean;
  bgUpscale: 1 | 2 | 4;
  
  // Actions
  setFile: (file: File | null) => void;
  setMode: (mode: FaceMode) => void;
  setWeight: (weight: number) => void;
  setFaceUpsample: (enabled: boolean) => void;
  setBackgroundEnhance: (enabled: boolean) => void;
  setBgUpscale: (scale: 1 | 2 | 4) => void;
  enhance: () => Promise<void>;
  reset: () => void;
  download: () => void;
}

const FaceEnhancementContext = createContext<FaceEnhancementContextValue | undefined>(undefined);

interface FaceEnhancementProviderProps {
  children: React.ReactNode;
}

/**
 * FaceEnhancementProvider
 * 
 * Context provider cho Face Enhancement feature.
 * Quản lý state và actions cho face enhancement workflow.
 */
export function FaceEnhancementProvider({ children }: FaceEnhancementProviderProps) {
  // File state
  const [file, setFileState] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null);
  const [enhancedBlob, setEnhancedBlob] = useState<Blob | null>(null);
  
  // Processing state
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<FaceEnhancementMetadata | undefined>(undefined);
  
  // Parameters
  const [mode, setMode] = useState<FaceMode>('restoration');
  const [weight, setWeight] = useState<number>(0.7);
  const [faceUpsample, setFaceUpsample] = useState<boolean>(true);
  const [backgroundEnhance, setBackgroundEnhance] = useState<boolean>(true);
  const [bgUpscale, setBgUpscale] = useState<1 | 2 | 4>(2);

  /**
   * Set file và tạo preview URL
   */
  const setFile = useCallback((newFile: File | null) => {
    // Cleanup old URLs
    if (originalImageUrl) {
      URL.revokeObjectURL(originalImageUrl);
    }
    if (enhancedImageUrl) {
      URL.revokeObjectURL(enhancedImageUrl);
    }

    if (newFile) {
      // Validate file
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (newFile.size > MAX_SIZE) {
        setError('File quá lớn. Kích thước tối đa là 10MB.');
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(newFile.type)) {
        setError('Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG và PNG.');
        return;
      }

      // Set file and create preview
      setFileState(newFile);
      const url = URL.createObjectURL(newFile);
      setOriginalImageUrl(url);
      
      // Reset processing state
      setStatus('idle');
      setError(null);
      setEnhancedImageUrl(null);
      setEnhancedBlob(null);
      setMetadata(undefined);
    } else {
      // Clear all state
      setFileState(null);
      setOriginalImageUrl(null);
      setEnhancedImageUrl(null);
      setEnhancedBlob(null);
      setStatus('idle');
      setError(null);
      setMetadata(undefined);
    }
  }, [originalImageUrl, enhancedImageUrl]);

  /**
   * Enhance face
   */
  const enhance = useCallback(async () => {
    if (!file) {
      setError('Vui lòng chọn ảnh trước');
      return;
    }

    setStatus('processing');
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
      setStatus('success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định';
      setError(errorMessage);
      setStatus('error');
    }
  }, [file, mode, weight, faceUpsample, backgroundEnhance, bgUpscale]);

  /**
   * Download enhanced image
   */
  const download = useCallback(() => {
    if (!enhancedBlob || !file) return;

    const url = URL.createObjectURL(enhancedBlob);
    const a = document.createElement('a');
    a.href = url;
    
    // Generate filename
    const originalName = file.name.replace(/\.[^/.]+$/, '');
    const extension = file.name.split('.').pop() || 'png';
    a.download = `${originalName}_enhanced_${mode}.${extension}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [enhancedBlob, file, mode]);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setFile(null);
  }, [setFile]);

  // Cleanup URLs on unmount
  React.useEffect(() => {
    return () => {
      if (originalImageUrl) {
        URL.revokeObjectURL(originalImageUrl);
      }
      if (enhancedImageUrl) {
        URL.revokeObjectURL(enhancedImageUrl);
      }
    };
  }, [originalImageUrl, enhancedImageUrl]);

  const value = useMemo(
    () => ({
      file,
      originalImageUrl,
      enhancedImageUrl,
      enhancedBlob,
      status,
      error,
      metadata,
      mode,
      weight,
      faceUpsample,
      backgroundEnhance,
      bgUpscale,
      setFile,
      setMode,
      setWeight,
      setFaceUpsample,
      setBackgroundEnhance,
      setBgUpscale,
      enhance,
      reset,
      download,
    }),
    [
      file,
      originalImageUrl,
      enhancedImageUrl,
      enhancedBlob,
      status,
      error,
      metadata,
      mode,
      weight,
      faceUpsample,
      backgroundEnhance,
      bgUpscale,
      setFile,
      enhance,
      reset,
      download,
    ]
  );

  return (
    <FaceEnhancementContext.Provider value={value}>
      {children}
    </FaceEnhancementContext.Provider>
  );
}

/**
 * Hook để sử dụng FaceEnhancementContext
 */
export function useFaceEnhancement() {
  const context = useContext(FaceEnhancementContext);
  if (context === undefined) {
    throw new Error('useFaceEnhancement must be used within FaceEnhancementProvider');
  }
  return context;
}
