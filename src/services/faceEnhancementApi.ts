/**
 * API Service cho Face Enhancement
 * 
 * Service này xử lý việc gọi API endpoint /upscale/enhance/face để enhance khuôn mặt
 * trong ảnh sử dụng CodeFormer với các mode khác nhau.
 * 
 * Requirements: 4.1-4.7
 */

import type { 
  FaceMode, 
  FaceEnhancementParams, 
  FaceEnhancementResponse,
  FaceEnhancementMetadata 
} from '@/types/face-enhancement';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Lấy URL đầy đủ cho API endpoint
 */
function getApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

/**
 * Parse metadata từ response headers
 * 
 * @param headers - Response headers từ fetch API
 * @returns FaceEnhancementMetadata object
 */
function parseMetadataFromHeaders(headers: Headers): FaceEnhancementMetadata {
  return {
    facesDetected: parseInt(headers.get('X-Faces-Detected') || '0', 10),
    processingTime: parseFloat(headers.get('X-Processing-Time') || '0'),
    modeUsed: (headers.get('X-Mode-Used') || 'restoration') as FaceMode,
    weightUsed: parseFloat(headers.get('X-Weight-Used') || '0.7'),
    backgroundEnhanced: headers.get('X-Background-Enhanced') === 'True',
    bgUpscale: parseInt(headers.get('X-BG-Upscale') || '2', 10),
    warning: headers.get('X-Warning') || undefined,
  };
}

/**
 * Convert error response thành user-friendly message
 * 
 * @param status - HTTP status code
 * @param detail - Error detail từ API
 * @returns User-friendly error message
 */
function getUserFriendlyErrorMessage(status: number, detail?: string): string {
  switch (status) {
    case 422:
      return detail || 'Tham số không hợp lệ. Vui lòng kiểm tra lại file và cấu hình.';
    case 503:
      return 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.';
    case 504:
      return 'Xử lý ảnh quá lâu (>30 giây). Vui lòng thử với ảnh nhỏ hơn.';
    case 413:
      return 'File quá lớn. Kích thước tối đa là 10MB.';
    case 415:
      return 'Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG và PNG.';
    default:
      return detail || `Lỗi không xác định (${status}). Vui lòng thử lại.`;
  }
}

/**
 * Enhance faces trong image sử dụng CodeFormer
 * 
 * @param file - Image file để enhance (JPG/PNG, max 10MB)
 * @param params - Face enhancement parameters (mode, weight, faceUpsample, backgroundEnhance, bgUpscale)
 * @returns Promise với enhanced image blob và metadata
 * @throws Error nếu request fails
 * 
 * @example
 * ```typescript
 * const result = await enhanceFace(imageFile, {
 *   mode: 'restoration',
 *   weight: 0.7,
 *   faceUpsample: true,
 *   backgroundEnhance: true,
 *   bgUpscale: 2
 * });
 * 
 * // Display enhanced image
 * const imageUrl = URL.createObjectURL(result.imageBlob);
 * console.log(`Processed ${result.metadata.facesDetected} faces`);
 * ```
 */
export async function enhanceFace(
  file: File,
  params: FaceEnhancementParams
): Promise<FaceEnhancementResponse> {
  // Validate file size (10MB = 10,485,760 bytes)
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File quá lớn. Kích thước tối đa là 10MB.');
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG và PNG.');
  }

  // Build FormData
  const formData = new FormData();
  formData.append('file', file);
  formData.append('mode', params.mode);

  // Chỉ thêm weight và face_upsample cho restoration mode
  // Theo requirements 4.4: weight parameter bị ignore cho non-restoration modes
  if (params.mode === 'restoration') {
    if (params.weight !== undefined) {
      formData.append('weight', params.weight.toString());
    }
    if (params.faceUpsample !== undefined) {
      formData.append('face_upsample', params.faceUpsample.toString());
    }
  }

  // Thêm background enhancement parameters (requirements 4.5, 11.10)
  if (params.backgroundEnhance !== undefined) {
    formData.append('background_enhance', params.backgroundEnhance.toString());
  }
  if (params.bgUpscale !== undefined) {
    formData.append('bg_upscale', params.bgUpscale.toString());
  }

  try {
    const response = await fetch(getApiUrl('/upscale/enhance/face'), {
      method: 'POST',
      body: formData,
    });

    // Handle error responses
    if (!response.ok) {
      let errorDetail: string | undefined;
      
      try {
        // Try to parse JSON error response
        const errorData = await response.json();
        errorDetail = errorData.detail;
      } catch {
        // If not JSON, use status text
        errorDetail = response.statusText;
      }

      const userMessage = getUserFriendlyErrorMessage(response.status, errorDetail);
      throw new Error(userMessage);
    }

    // Parse successful response
    const imageBlob = await response.blob();
    const metadata = parseMetadataFromHeaders(response.headers);

    // Debug: Log headers và metadata
    console.log('=== Face Enhancement Response Debug ===');
    console.log('Response headers:', {
      'X-Faces-Detected': response.headers.get('X-Faces-Detected'),
      'X-Processing-Time': response.headers.get('X-Processing-Time'),
      'X-Mode-Used': response.headers.get('X-Mode-Used'),
      'X-Weight-Used': response.headers.get('X-Weight-Used'),
      'X-Background-Enhanced': response.headers.get('X-Background-Enhanced'),
      'X-BG-Upscale': response.headers.get('X-BG-Upscale'),
      'X-Warning': response.headers.get('X-Warning'),
    });
    console.log('Parsed metadata:', metadata);
    console.log('=======================================');

    return {
      imageBlob,
      metadata,
    };
  } catch (error) {
    // Network errors hoặc errors từ fetch
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.');
  }
}

/**
 * Check xem face enhancement service có sẵn sàng không
 * 
 * @returns Promise<boolean> - true nếu service ready
 */
export async function checkFaceEnhancementReady(): Promise<boolean> {
  try {
    const response = await fetch(getApiUrl('/health/ready'));
    if (!response.ok) return false;
    
    const data = await response.json();
    return data.ready === true;
  } catch {
    return false;
  }
}
