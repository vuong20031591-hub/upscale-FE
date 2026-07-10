// Constants for AI Image Upscaler

// File upload constraints (FR-UP-002, FR-UP-003)
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MiB in bytes
export const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};
export const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// Resolution options (FR-CF-001)
export const RESOLUTION_OPTIONS = [
  {
    value: '2k' as const,
    label: '2K',
    description: '2560×1440',
    width: 2560,
    height: 1440,
  },
  {
    value: '4k' as const,
    label: '4K',
    description: '3840×2160',
    width: 3840,
    height: 2160,
  },
];

// Method options (FR-CF-003)
export const METHOD_OPTIONS = [
  {
    value: 'smart' as const,
    label: 'Smart Auto',
    description: 'AI tự động phát hiện và chọn mode xử lý phù hợp nhất',
    badge: 'Mới',
  },
  {
    value: 'ai' as const,
    label: 'AI Enhancement',
    description: 'High-quality AI-powered upscaling with detail preservation',
  },
  {
    value: 'standard' as const,
    label: 'Standard (Lanczos)',
    description: 'Fast traditional interpolation method',
  },
];

// Default configuration (FR-CF-006)
export const DEFAULT_CONFIG = {
  resolution: '2k' as const,
  method: 'smart' as const, // Default to smart auto-detection
};

// API endpoints (FR-IN-001 to FR-IN-005)
export const API_ENDPOINTS = {
  health: '/health',
  ready: '/health/ready',
  config: '/health/config',
  upscaleAi: '/upscale/ai',
  upscaleStandard: '/upscale/standard',
  upscaleSmart: '/upscale/smart', // Smart auto-detection endpoint
  resolutions: '/upscale/resolutions',
};

// Sample images (FR-UP-008, FR-UP-009)
export const SAMPLE_IMAGES = [
  {
    id: '1',
    src: '/samples/sample1.jpg',
    alt: 'Sample image 1',
    category: 'general' as const,
  },
  {
    id: '2',
    src: '/samples/sample2.jpg',
    alt: 'Sample image 2',
    category: 'general' as const,
  },
  {
    id: '3',
    src: '/samples/sample3.jpg',
    alt: 'Sample image 3',
    category: 'general' as const,
  },
];

// Toast configuration
export const TOAST_DURATION = 5000; // 5 seconds

// Animation durations (Design Section 8.1)
export const ANIMATION_DURATION = {
  buttonHover: 200,
  cardHover: 200,
  progressBar: 300,
  toastSlideIn: 300,
  toastFadeOut: 200,
  stateChange: 150,
};

// Comparison slider
export const SLIDER_DEFAULT_POSITION = 50;
export const SLIDER_STEP = 5; // 5% increments for keyboard navigation
