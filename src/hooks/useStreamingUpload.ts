// Hook cho streaming upload với SSE progress tracking

import { useState, useCallback, useRef } from 'react';
import type { UpscaleConfig, UpscaleResult } from '@/types';

interface StreamingProgress {
  status: 'queued' | 'loading' | 'processing' | 'encoding' | 'complete' | 'error';
  progress: number;
  message: string;
  original_width?: number;
  original_height?: number;
  result?: {
    image_data: string;
    resolution: string;
    scale_factor: number;
    width: number;
    height: number;
    original_width?: number;
    original_height?: number;
    processing_time_ms?: number;
    file_size_bytes?: number;
  };
  error?: string;
}

export function useStreamingUpload() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<StreamingProgress['status']>('complete'); // Start as 'complete' (idle)
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<UpscaleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const upload = useCallback(async (file: File, config: UpscaleConfig) => {
    try {
      // Reset state
      setProgress(0);
      setStatus('queued');
      setMessage('Đang khởi tạo...');
      setError(null);
      setResult(null);

      // Create abort controller
      abortControllerRef.current = new AbortController();

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      // ⚡ Smart Auto-Detection: Direct upload without streaming
      if (config.method === 'smart') {
        setStatus('loading');
        setMessage('Đang upload và phân tích ảnh...');
        setProgress(30);

        const formData = new FormData();
        formData.append('file', file);
        
        // ⚡ Truyền bg_upscale từ resolution option (2X hoặc 4X)
        const bgUpscale = config.resolution === '4X' ? 4 : 2;
        formData.append('bg_upscale', bgUpscale.toString());

        const response = await fetch(`${API_BASE}/upscale/smart`, {
          method: 'POST',
          body: formData,
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: 'Upload failed' }));
          throw new Error(errorData.detail || 'Smart processing failed');
        }

        setStatus('processing');
        setMessage('Đang xử lý với AI...');
        setProgress(60);

        // Get image blob and metadata from headers
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        // Extract metadata from response headers
        const detectedMode = response.headers.get('X-Mode-Used') || undefined;
        const originalWidth = response.headers.get('X-Original-Width');
        const originalHeight = response.headers.get('X-Original-Height');
        const finalWidth = response.headers.get('X-Final-Width');
        const finalHeight = response.headers.get('X-Final-Height');
        const processingTime = response.headers.get('X-Processing-Time');

        setStatus('encoding');
        setMessage('Hoàn tất...');
        setProgress(90);

        const originalRes = originalWidth && originalHeight
          ? `${originalWidth}x${originalHeight}`
          : 'unknown';
        const upscaledRes = finalWidth && finalHeight
          ? `${finalWidth}x${finalHeight}`
          : 'unknown';

        setResult({
          imageUrl,
          originalResolution: originalRes,
          upscaledResolution: upscaledRes,
          fileSizeBytes: blob.size,
          processingTimeMs: processingTime ? parseFloat(processingTime.replace('s', '')) * 1000 : 0,
          scaleFactor: undefined, // Smart mode doesn't have fixed scale factor
          detectedMode,
        });

        setStatus('complete');
        setProgress(100);
        setMessage('Hoàn thành!');
        return;
      }

      // ⚡ Original streaming upload for AI/Standard methods
      // Step 1: Start upscale job
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_resolution', config.resolution);

      const startResponse = await fetch(`${API_BASE}/upscale/ai/stream`, {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      if (!startResponse.ok) {
        throw new Error('Failed to start upscale job');
      }

      const { job_id } = await startResponse.json();

      // Step 2: Connect to SSE for progress updates
      const eventSource = new EventSource(`${API_BASE}/upscale/progress/${job_id}`);
      eventSourceRef.current = eventSource;

      eventSource.addEventListener('progress', (event) => {
        const data: StreamingProgress = JSON.parse(event.data);
        
        setProgress(data.progress);
        setStatus(data.status);
        setMessage(data.message);

        if (data.status === 'complete' && data.result) {
          // Convert base64 to blob URL
          const binaryString = atob(data.result.image_data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'image/png' });
          const imageUrl = URL.createObjectURL(blob);

          // Use metadata from backend
          const originalRes = data.result.original_width && data.result.original_height
            ? `${data.result.original_width}x${data.result.original_height}`
            : 'unknown';

          setResult({
            imageUrl,
            originalResolution: originalRes,
            upscaledResolution: `${data.result.width}x${data.result.height}`,
            fileSizeBytes: data.result.file_size_bytes || blob.size,
            processingTimeMs: data.result.processing_time_ms || 0,
            scaleFactor: data.result.scale_factor,
          });

          eventSource.close();
        } else if (data.status === 'error') {
          setError(data.error || 'Processing failed');
          eventSource.close();
        }
      });

      eventSource.addEventListener('error', () => {
        setError('Connection lost');
        eventSource.close();
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      setStatus('error');
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
  }, []);

  // ⚡ Sửa: Thêm function reset result để clear khi chọn ảnh mới
  const resetResult = useCallback(() => {
    setResult(null);
    setError(null);
    setProgress(0);
    setStatus('complete'); // 'complete' = idle state
    setMessage('');
  }, []);

  return {
    progress,
    status,
    message,
    result,
    error,
    upload,
    cancel,
    resetResult, // ⚡ Export resetResult
  };
}
