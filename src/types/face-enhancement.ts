// Type definitions for Face Enhancement feature

/**
 * Face enhancement processing modes.
 * 
 * - restoration: Enhance facial details in old or low-quality photos
 * - colorization: Add color to black-and-white or grayscale photos
 * - inpainting: Fill damaged or masked regions in faces
 */
export type FaceMode = "restoration" | "colorization" | "inpainting";

/**
 * Parameters for face enhancement request.
 */
export interface FaceEnhancementParams {
  /** Processing mode */
  mode: FaceMode;
  
  /** 
   * Fidelity weight (0-1, only for restoration mode).
   * Higher values preserve more original detail.
   * Ignored for colorization and inpainting modes.
   */
  weight?: number;
  
  /** 
   * Enable face upsampling (only for restoration mode).
   * Ignored for colorization and inpainting modes.
   */
  faceUpsample?: boolean;
  
  /** 
   * Enable background enhancement with Real-ESRGAN.
   * Default: true
   */
  backgroundEnhance?: boolean;
  
  /** 
   * Background upscale factor (1, 2, or 4).
   * - 1: Skip enhancement (Real-ESRGAN x4plus does not support 1x)
   * - 2: 2x upscale with quality enhancement
   * - 4: 4x upscale with quality enhancement
   * Default: 2
   */
  bgUpscale?: number;
}

/**
 * Metadata returned from face enhancement processing.
 */
export interface FaceEnhancementMetadata {
  /** Number of faces detected and processed */
  facesDetected: number;
  
  /** Processing time in seconds */
  processingTime: number;
  
  /** Mode that was applied */
  modeUsed: FaceMode;
  
  /** Weight value that was used (fixed for colorization/inpainting) */
  weightUsed: number;
  
  /** Whether background was enhanced with Real-ESRGAN */
  backgroundEnhanced: boolean;
  
  /** Background upscale factor used (1, 2, or 4) */
  bgUpscale: number;
  
  /** Warning message if any (e.g., "No faces detected") */
  warning?: string;
}

/**
 * Response from face enhancement API.
 */
export interface FaceEnhancementResponse {
  /** Enhanced image as Blob */
  imageBlob: Blob;
  
  /** Processing metadata */
  metadata: FaceEnhancementMetadata;
}
