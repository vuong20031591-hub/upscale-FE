import { API_ENDPOINTS } from './constants';
import { getAccessToken } from './auth-token';
import type { UpscaleConfig, UpscaleResult, ApiError } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function getApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}


// Health check
export async function checkHealth(): Promise<{ ready: boolean }> {
  const response = await fetch(getApiUrl(API_ENDPOINTS.health));
  if (!response.ok) throw new Error('Health check failed');
  return response.json();
}

// Check if model is ready
export async function checkReady(): Promise<{ ready: boolean }> {
  const response = await fetch(getApiUrl(API_ENDPOINTS.ready));
  if (!response.ok) throw new Error('Ready check failed');
  return response.json();
}

// Get config
export async function getConfig(): Promise<{
  upload: { max_file_size: number; allowed_types: string[] };
  output: { supported_resolutions: string[] };
}> {
  const response = await fetch(getApiUrl(API_ENDPOINTS.config));
  if (!response.ok) throw new Error('Failed to get config');
  return response.json();
}

// Upscale image with progress tracking
export function upscaleImage(
  file: File,
  config: UpscaleConfig,
  onProgress: (progress: number) => void
): Promise<UpscaleResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const endpoint =
      config.method === 'ai'
        ? API_ENDPOINTS.upscaleAi
        : API_ENDPOINTS.upscaleStandard;

    // ⚡ Set response type to blob for binary image data
    xhr.responseType = 'blob';

    // Setup progress tracking
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          // ⚡ Backend returns binary PNG image, not JSON
          const blob = xhr.response as Blob;
          const imageUrl = URL.createObjectURL(blob);
          
          // ⚡ Extract metadata from response headers
          const resolution = xhr.getResponseHeader('X-Image-Resolution') || 'unknown';
          const scaleFactor = xhr.getResponseHeader('X-Scale-Factor') || '1.0';
          
          // ⚡ Get original image dimensions from file
          const img = new Image();
          const originalResPromise = new Promise<string>((resolveRes) => {
            img.onload = () => {
              resolveRes(`${img.width}x${img.height}`);
              URL.revokeObjectURL(img.src);
            };
            img.onerror = () => {
              resolveRes('unknown');
              URL.revokeObjectURL(img.src);
            };
            img.src = URL.createObjectURL(file);
          });

          originalResPromise.then((originalResolution) => {
            resolve({
              imageUrl,
              originalResolution,
              upscaledResolution: resolution,
              fileSizeBytes: blob.size,
              processingTimeMs: 0, // Not available from headers
              scaleFactor: parseFloat(scaleFactor),
            });
          });
        } catch (error) {
          reject(new Error('Invalid response format'));
        }
      } else {
        // ⚡ Error responses are still JSON
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const error: ApiError = JSON.parse(reader.result as string);
            reject(new Error(error.detail || 'Upload failed'));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        reader.readAsText(xhr.response);
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error. Please check your connection.'));
    };

    xhr.ontimeout = () => {
      reject(new Error('Request timeout. Please try again.'));
    };

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_resolution', config.resolution);

    // Send request
    xhr.open('POST', getApiUrl(endpoint));
    const token = getAccessToken();
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  });
}

// Download image
export async function downloadImage(url: string, filename: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to download image');

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(objectUrl);
}
