/**
 * Adapter để convert Face Enhancement data sang format của Upscale Result
 * Cho phép dùng chung ResultView component
 */

import type { UpscaleResult } from '@/types';
import type { FaceEnhancementMetadata } from '@/types/face-enhancement';

/**
 * Convert Face Enhancement metadata sang UpscaleResult format
 * 
 * @param metadata - Face enhancement metadata từ API
 * @param originalImageUrl - URL của ảnh gốc
 * @param enhancedImageUrl - URL của ảnh đã enhance
 * @param fileSizeBytes - Kích thước file (bytes)
 * @returns UpscaleResult object để dùng với ResultView
 */
export function adaptFaceEnhancementToUpscaleResult(
  metadata: FaceEnhancementMetadata,
  originalImageUrl: string,
  enhancedImageUrl: string,
  fileSizeBytes: number
): UpscaleResult {
  // Convert processing time từ seconds sang milliseconds
  const processingTimeMs = Math.round(metadata.processingTime * 1000);

  // Tạo resolution string từ metadata
  // Note: Face enhancement không thay đổi resolution, chỉ cải thiện chất lượng
  // Nếu có background upscale, resolution sẽ tăng theo bgUpscale factor
  const scaleFactor = metadata.backgroundEnhanced ? metadata.bgUpscale : 1;

  return {
    imageUrl: enhancedImageUrl,
    originalResolution: 'Original', // Sẽ được override bởi actual dimensions
    upscaledResolution: metadata.backgroundEnhanced 
      ? `Enhanced ${scaleFactor}x` 
      : 'Enhanced',
    fileSizeBytes,
    processingTimeMs,
    scaleFactor,
  };
}

/**
 * Format mode name cho display
 */
export function formatModeName(mode: string): string {
  const modeNames: Record<string, string> = {
    restoration: 'Restoration',
    colorization: 'Colorization',
    inpainting: 'Inpainting',
  };
  return modeNames[mode] || mode;
}

/**
 * Get mode description
 */
export function getModeDescription(mode: string): string {
  const descriptions: Record<string, string> = {
    restoration: 'Cải thiện chi tiết khuôn mặt',
    colorization: 'Thêm màu vào ảnh đen trắng',
    inpainting: 'Sửa chữa vùng bị hỏng',
  };
  return descriptions[mode] || '';
}
