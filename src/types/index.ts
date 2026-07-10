// Type definitions for AI Image Upscaler

export type UpscaleStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export type Resolution = '2k' | '4k';

export type UpscaleMethod = 'ai' | 'standard' | 'smart';

export interface UpscaleConfig {
  resolution: Resolution;
  method: UpscaleMethod;
}

export interface ImageMetadata {
  width: number;
  height: number;
}

export interface UpscaleResult {
  imageUrl: string;
  originalResolution: string; // Format: "WIDTHxHEIGHT" or filename
  upscaledResolution: string; // Format: "WIDTHxHEIGHT"
  fileSizeBytes: number;
  processingTimeMs: number;
  scaleFactor?: number; // Scale factor from backend
  detectedMode?: string; // Smart auto-detection: detected processing mode
  detectedIssues?: string[]; // Smart auto-detection: detected issues
}

export interface UpscaleRequest {
  file: File;
  targetResolution: Resolution;
}

export interface ApiError {
  detail: string;
  statusCode: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
}

export interface SampleImage {
  id: string;
  src: string;
  alt: string;
  category: 'portrait' | 'landscape' | 'ai-art' | 'general';
}
