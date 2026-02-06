/**
 * Post-Processing for YOLOv8 Segmentation
 * Generates binary masks from prototypes and calculates nutrition using physics-based algorithm
 */

import type { Detection, RawDetection, NutritionInfo, FoodInfo } from './types';
import { getFoodInfo } from './foodDatabase';
import { INFERENCE_CONFIG } from '@/lib/constants';

/**
 * Process raw detections to generate masks and calculate nutrition
 * @param detections - Filtered detections from NMS
 * @param maskProtos - Mask prototypes tensor from YOLO output1 [1, 32, 160, 160]
 * @param protoDims - Dimensions of mask prototypes tensor
 * @returns Complete detection results with masks and nutrition
 */
export async function processDetections(
  detections: RawDetection[],
  maskProtos: Float32Array,
  protoDims: number[]
): Promise<Detection[]> {
  const results: Detection[] = [];

  for (const detection of detections) {
    // Get food information from database
    const foodInfo = getFoodInfo(detection.classId);

    // Generate binary mask from prototypes
    const mask = generateMask(detection.maskCoeffs, maskProtos, protoDims);

    // Calculate nutrition using physics-based algorithm
    const nutrition = calculateNutrition(mask, foodInfo);

    // Create complete detection result
    results.push({
      classId: detection.classId,
      label: foodInfo.name,
      confidence: detection.confidence,
      box: detection.box,
      mask,
      nutrition,
      icon: foodInfo.icon,
    });
  }

  return results;
}

/**
 * Generate binary segmentation mask from YOLO mask prototypes
 * @param coeffs - Mask coefficients from detection (32 values)
 * @param protos - Mask prototypes [1, 32, 160, 160] flattened
 * @param dims - Tensor dimensions [1, 32, 160, 160]
 * @returns Binary mask (640x640 flat array of 0/1 values)
 */
function generateMask(
  coeffs: Float32Array,
  protos: Float32Array,
  dims: number[]
): number[] {
  const [_, numProtos, protoH, protoW] = dims; // [1, 32, 160, 160]
  const outputSize = protoH * protoW; // 25,600 pixels

  // Matrix multiplication: (1x32) @ (32x25600) = (1x25600)
  // Each prototype is weighted by its coefficient
  const mask = new Float32Array(outputSize);

  for (let i = 0; i < outputSize; i++) {
    let sum = 0;

    // Weighted sum of all 32 prototype channels
    for (let c = 0; c < numProtos; c++) {
      sum += coeffs[c] * protos[c * outputSize + i];
    }

    // Apply sigmoid activation: 1 / (1 + exp(-x))
    mask[i] = 1 / (1 + Math.exp(-sum));
  }

  // Debug: Check mask values before resize
  const maskMin = Math.min(...mask);
  const maskMax = Math.max(...mask);
  const maskMean = mask.reduce((sum, val) => sum + val, 0) / mask.length;
  console.log('[Mask Gen] Before resize:', { min: maskMin, max: maskMax, mean: maskMean });

  // Resize from 160x160 to 640x640 and binarize
  const binaryMask = resizeAndBinarizeMask(
    mask,
    protoH,
    protoW,
    INFERENCE_CONFIG.INPUT_SIZE,
    INFERENCE_CONFIG.INPUT_SIZE,
    INFERENCE_CONFIG.MASK_THRESHOLD
  );

  // Debug: Check binary mask
  const pixelCount = binaryMask.reduce((sum, val) => sum + val, 0);
  console.log('[Mask Gen] After resize:', { length: binaryMask.length, pixelCount });

  return binaryMask;
}

/**
 * Resize mask from source dimensions to target dimensions and binarize
 * @param mask - Source mask (160x160 flattened)
 * @param srcH - Source height (160)
 * @param srcW - Source width (160)
 * @param dstH - Target height (640)
 * @param dstW - Target width (640)
 * @param threshold - Binarization threshold (0.5)
 * @returns Binary mask array (640x640 = 409,600 values of 0 or 1)
 */
function resizeAndBinarizeMask(
  mask: Float32Array,
  srcH: number,
  srcW: number,
  dstH: number,
  dstW: number,
  threshold: number
): number[] {
  const result = new Array(dstH * dstW);
  const scaleX = srcW / dstW;
  const scaleY = srcH / dstH;

  // Nearest neighbor interpolation
  for (let y = 0; y < dstH; y++) {
    for (let x = 0; x < dstW; x++) {
      const srcX = Math.floor(x * scaleX);
      const srcY = Math.floor(y * scaleY);
      const value = mask[srcY * srcW + srcX];

      // Binarize: 1 if above threshold, 0 otherwise
      result[y * dstW + x] = value >= threshold ? 1 : 0;
    }
  }

  return result;
}

/**
 * CRITICAL: Calculate nutrition using the exact NutriScan physics-based algorithm
 *
 * Algorithm steps:
 * 1. Count mask pixels (area in pixels)
 * 2. Convert pixel area to real-world area (cm²) using calibration ratio
 * 3. Calculate volume (cm³) using food-specific thickness
 * 4. Calculate weight (g) using food-specific density
 * 5. Calculate calories and macros from weight
 *
 * Calibration: 640px = 30cm (pixel_ratio = 30/640 cm per pixel)
 *
 * @param mask - Binary mask (640x640 flat array)
 * @param foodInfo - Food metadata (density, thickness, nutrition per 100g)
 * @returns Calculated nutrition information
 */
function calculateNutrition(mask: number[], foodInfo: FoodInfo): NutritionInfo {
  // Step 1: Count mask pixels (area in pixels)
  const pixelCount = mask.reduce((sum, val) => sum + val, 0);

  console.log('[Nutrition Calc]', {
    food: foodInfo.name,
    maskLength: mask.length,
    pixelCount,
    density: foodInfo.density,
    thickness: foodInfo.defaultThicknessCm,
  });

  // If no pixels, return zero nutrition
  if (pixelCount === 0) {
    console.warn('[Nutrition Calc] WARNING: Pixel count is 0 for', foodInfo.name);
    return {
      weightGrams: 0,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };
  }

  // Step 2: Pixel-to-real-world scaling
  // Assumption: 640px = 30cm in real world
  const pixelRatio = INFERENCE_CONFIG.PIXEL_RATIO; // 30 / 640 cm per pixel

  // Calculate real area in cm²
  const areaRealCm2 = pixelCount * (pixelRatio ** 2);

  // Step 3: Volume estimation (cm³)
  // Volume = Area × Thickness
  const volumeCm3 = areaRealCm2 * foodInfo.defaultThicknessCm;

  // Step 4: Weight calculation (grams)
  // Weight = Volume × Density
  const weightGrams = volumeCm3 * foodInfo.density;

  // Step 5: Nutrition calculation from weight
  // Database values are per 100g, so scale by (weight / 100)
  const scaleFactor = weightGrams / 100;

  return {
    weightGrams,
    calories: scaleFactor * foodInfo.caloriesPer100g,
    protein: scaleFactor * foodInfo.proteinPer100g,
    carbs: scaleFactor * foodInfo.carbsPer100g,
    fat: scaleFactor * foodInfo.fatPer100g,
    fiber: scaleFactor * foodInfo.fiberPer100g,
  };
}

/**
 * Calculate total nutrition from multiple detections
 * @param detections - Array of detection results
 * @returns Aggregated nutrition info
 */
export function aggregateNutrition(detections: Detection[]): NutritionInfo {
  return detections.reduce(
    (total, detection) => ({
      weightGrams: total.weightGrams + detection.nutrition.weightGrams,
      calories: total.calories + detection.nutrition.calories,
      protein: total.protein + detection.nutrition.protein,
      carbs: total.carbs + detection.nutrition.carbs,
      fat: total.fat + detection.nutrition.fat,
      fiber: total.fiber + detection.nutrition.fiber,
    }),
    {
      weightGrams: 0,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    }
  );
}

/**
 * Utility: Count non-zero pixels in mask
 * @param mask - Binary mask array
 * @returns Number of non-zero pixels
 */
export function countMaskPixels(mask: number[]): number {
  return mask.reduce((sum, val) => sum + val, 0);
}

/**
 * Utility: Log nutrition calculation details (for debugging)
 * @param mask - Binary mask
 * @param foodInfo - Food metadata
 * @param nutrition - Calculated nutrition
 */
export function logNutritionCalculation(
  mask: number[],
  foodInfo: FoodInfo,
  nutrition: NutritionInfo
): void {
  const pixelCount = countMaskPixels(mask);
  const pixelRatio = INFERENCE_CONFIG.PIXEL_RATIO;
  const areaRealCm2 = pixelCount * (pixelRatio ** 2);
  const volumeCm3 = areaRealCm2 * foodInfo.defaultThicknessCm;

  console.log('[Nutrition Calculation]', {
    food: foodInfo.name,
    pixelCount,
    areaRealCm2: areaRealCm2.toFixed(2),
    volumeCm3: volumeCm3.toFixed(2),
    density: foodInfo.density,
    thickness: foodInfo.defaultThicknessCm,
    weightGrams: nutrition.weightGrams.toFixed(1),
    calories: nutrition.calories.toFixed(0),
  });
}
