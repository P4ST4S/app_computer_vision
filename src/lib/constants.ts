// Application constants

export const APP_NAME = "NutriScan" as const;
export const APP_DESCRIPTION = "Scanner nutritionnel" as const;

// Scan configuration
export const SCAN_DELAY_MS = 1500;
export const MAX_HISTORY_ITEMS = 10;

// Camera configuration
export const CAMERA_CONFIG = {
  facingMode: "user", // Utilise la caméra frontale (pour ordinateur/smartphone)
  width: { ideal: 1280 },
  height: { ideal: 720 },
} as const;

// Configuration alternative pour mobile (caméra arrière)
export const CAMERA_CONFIG_ENVIRONMENT = {
  facingMode: { exact: "environment" },
  width: { ideal: 1280 },
  height: { ideal: 720 },
} as const;

// Nutrient limits (for progress bars)
export const NUTRIENT_LIMITS = {
  protein: 50,
  carbs: 50,
  fat: 50,
  fiber: 15,
} as const;

// App URL configuration (for deployment)
// Leave empty to auto-detect (works for both dev and production)
// Or set via NEXT_PUBLIC_APP_URL env variable: 'https://your-domain.com'
export const APP_BASE_URL = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL
  : '';

// Inference configuration
export const INFERENCE_CONFIG = {
  MODEL_PATH: '/models/best.onnx',
  INPUT_SIZE: 640,
  CONFIDENCE_THRESHOLD: 0.25,
  IOU_THRESHOLD: 0.45,
  MAX_DETECTIONS: 100,
  MASK_THRESHOLD: 0.5,
  PIXEL_RATIO: 30 / 640, // 30cm real world = 640px assumption
} as const;
