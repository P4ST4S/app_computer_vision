/**
 * TypeScript type definitions for NutriScan inference engine
 * Defines all interfaces for worker communication, detection results, and nutrition data
 */

// ============================================================================
// Worker Communication Types
// ============================================================================

/**
 * Message types sent from main thread to worker
 */
export type WorkerRequest =
  | { id: string; type: 'INIT' }
  | { id: string; type: 'INFER'; payload: { imageData: string | ImageBitmap } }
  | { id: string; type: 'TERMINATE' };

/**
 * Response types sent from worker to main thread
 */
export type WorkerResponse =
  | { id: string; type: 'INIT_SUCCESS' }
  | { id: string; type: 'INFER_SUCCESS'; payload: InferenceResult }
  | { id: string; type: 'TERMINATE_SUCCESS' }
  | { id: string; type: 'ERROR'; payload: { message: string } };

// ============================================================================
// Inference Result Types
// ============================================================================

/**
 * Complete inference result returned by worker
 */
export interface InferenceResult {
  /** Array of detected food items with nutrition info */
  detections: Detection[];
  /** Sum of calories from all detections */
  totalCalories: number;
  /** Total processing time in milliseconds */
  processingTime: number;
  /** Optional message (e.g., "No detections found") */
  message?: string;
}

/**
 * Single food detection with segmentation mask and nutrition
 */
export interface Detection {
  /** Class ID from YOLO model (0-11 for 12 food classes) */
  classId: number;
  /** Human-readable food label (e.g., "Pain", "Poulet") */
  label: string;
  /** Detection confidence score (0-1) */
  confidence: number;
  /** Bounding box in normalized coordinates */
  box: BoundingBox;
  /** Segmentation mask (640x640 flat array of 0/1 values) */
  mask: number[];
  /** Calculated nutrition information */
  nutrition: NutritionInfo;
  /** Food emoji icon */
  icon: string;
}

/**
 * Bounding box in normalized coordinates (0-1 range)
 */
export interface BoundingBox {
  /** Center X coordinate (normalized 0-1) */
  x: number;
  /** Center Y coordinate (normalized 0-1) */
  y: number;
  /** Width (normalized 0-1) */
  width: number;
  /** Height (normalized 0-1) */
  height: number;
}

/**
 * Calculated nutrition information for detected food item
 */
export interface NutritionInfo {
  /** Estimated weight in grams */
  weightGrams: number;
  /** Calculated calories (kcal) */
  calories: number;
  /** Protein in grams */
  protein: number;
  /** Carbohydrates in grams */
  carbs: number;
  /** Fat in grams */
  fat: number;
  /** Fiber in grams */
  fiber: number;
}

// ============================================================================
// Food Database Types
// ============================================================================

/**
 * Food metadata from nutrition database
 * Used for calorie calculation algorithm
 */
export interface FoodInfo {
  /** Class ID (0-11) */
  id: number;
  /** Food name in French */
  name: string;
  /** Density in g/cm³ (used for weight calculation) */
  density: number;
  /** Default thickness in cm (volume estimation) */
  defaultThicknessCm: number;
  /** Calories per 100g */
  caloriesPer100g: number;
  /** Protein per 100g */
  proteinPer100g: number;
  /** Carbohydrates per 100g */
  carbsPer100g: number;
  /** Fat per 100g */
  fatPer100g: number;
  /** Fiber per 100g */
  fiberPer100g: number;
  /** Emoji icon for display */
  icon: string;
}

// ============================================================================
// Internal Processing Types (used within worker)
// ============================================================================

/**
 * Raw detection before mask generation and nutrition calculation
 * Used internally during YOLO output parsing
 */
export interface RawDetection {
  /** Class ID */
  classId: number;
  /** Confidence score */
  confidence: number;
  /** Bounding box */
  box: BoundingBox;
  /** Mask coefficients from YOLO (32 values) */
  maskCoeffs: Float32Array;
}
