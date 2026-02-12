/**
 * Post-Processing for YOLOv8 Segmentation
 * Generates binary masks from prototypes and calculates nutrition using calibrated portion scaling
 */

import type {
  Detection,
  RawDetection,
  NutritionInfo,
  FoodInfo,
  BoundingBox,
} from "./types";
import { getFoodInfo } from "./foodDatabase";
import { INFERENCE_CONFIG } from "@/lib/constants";

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
  protoDims: number[],
): Promise<Detection[]> {
  const results: Detection[] = [];

  for (const detection of detections) {
    // Get food information from database
    const foodInfo = getFoodInfo(detection.classId);

    // Generate binary mask from prototypes
    const rawMask = generateMask(detection.maskCoeffs, maskProtos, protoDims);
    const mask = cropMaskToBoundingBox(
      rawMask,
      detection.box,
      INFERENCE_CONFIG.INPUT_SIZE,
    );
    const rawPixelCount = countMaskPixels(rawMask);
    const croppedPixelCount = countMaskPixels(mask);
    const totalPixels = INFERENCE_CONFIG.INPUT_SIZE ** 2;

    console.log("[Postprocess] Mask stats", {
      classId: detection.classId,
      label: foodInfo.name,
      confidence: Number(detection.confidence.toFixed(3)),
      box: {
        x: Number(detection.box.x.toFixed(3)),
        y: Number(detection.box.y.toFixed(3)),
        width: Number(detection.box.width.toFixed(3)),
        height: Number(detection.box.height.toFixed(3)),
        areaRatio: Number(
          (detection.box.width * detection.box.height).toFixed(4),
        ),
      },
      rawPixelCount,
      croppedPixelCount,
      rawMaskRatio: Number((rawPixelCount / totalPixels).toFixed(4)),
      croppedMaskRatio: Number((croppedPixelCount / totalPixels).toFixed(4)),
    });

    // Calculate nutrition using calibrated portion scaling
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
  dims: number[],
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

  // Resize from 160x160 to 640x640 and binarize
  const binaryMask = resizeAndBinarizeMask(
    mask,
    protoH,
    protoW,
    INFERENCE_CONFIG.INPUT_SIZE,
    INFERENCE_CONFIG.INPUT_SIZE,
    INFERENCE_CONFIG.MASK_THRESHOLD,
  );

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
  threshold: number,
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
 * Crop a full-image mask to the detection bounding box.
 * YOLOv8 segmentation mask coefficients can produce activations outside the object;
 * restricting to bbox keeps area estimation aligned with the detection extent.
 */
function cropMaskToBoundingBox(
  mask: number[],
  box: BoundingBox,
  imageSize: number,
): number[] {
  const xMinNorm = clamp01(box.x - box.width / 2);
  const yMinNorm = clamp01(box.y - box.height / 2);
  const xMaxNorm = clamp01(box.x + box.width / 2);
  const yMaxNorm = clamp01(box.y + box.height / 2);

  const xMin = Math.floor(xMinNorm * imageSize);
  const yMin = Math.floor(yMinNorm * imageSize);
  const xMax = Math.ceil(xMaxNorm * imageSize);
  const yMax = Math.ceil(yMaxNorm * imageSize);

  if (xMin >= xMax || yMin >= yMax) {
    return new Array(mask.length).fill(0);
  }

  const croppedMask = new Array(mask.length).fill(0);
  for (let y = yMin; y < yMax; y++) {
    for (let x = xMin; x < xMax; x++) {
      const idx = y * imageSize + x;
      croppedMask[idx] = mask[idx];
    }
  }
  return croppedMask;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * Calculate nutrition using calibrated portion lookup and mask scaling
 * @param mask - Binary mask (640x640 flat array)
 * @param foodInfo - Food metadata (portion defaults, mask ratio, nutrition per 100g)
 * @returns Calculated nutrition information
 */
function calculateNutrition(mask: number[], foodInfo: FoodInfo): NutritionInfo {
  const totalPixels = INFERENCE_CONFIG.INPUT_SIZE ** 2; // 409,600
  const pixelCount = mask.reduce((sum, val) => sum + val, 0);

  if (pixelCount === 0) {
    return {
      weightGrams: 0,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };
  }

  const maskRatio = pixelCount / totalPixels;
  const calibratedMaskRatio =
    maskRatio * INFERENCE_CONFIG.MASK_RATIO_CALIBRATION;
  const scaleFactor = calibratedMaskRatio / foodInfo.expectedMaskRatio;
  const unclampedWeightGrams = foodInfo.defaultPortionWeightG * scaleFactor;
  const weightGrams = Math.min(unclampedWeightGrams, foodInfo.maxWeightG);
  const scale = weightGrams / 100;
  const capped = unclampedWeightGrams > foodInfo.maxWeightG;

  console.log("[Nutrition] Weight calculation", {
    food: foodInfo.name,
    pixelCount,
    totalPixels,
    maskRatio: Number(maskRatio.toFixed(4)),
    maskRatioCalibration: INFERENCE_CONFIG.MASK_RATIO_CALIBRATION,
    calibratedMaskRatio: Number(calibratedMaskRatio.toFixed(4)),
    expectedMaskRatio: foodInfo.expectedMaskRatio,
    scaleFactor: Number(scaleFactor.toFixed(3)),
    defaultPortionWeightG: foodInfo.defaultPortionWeightG,
    unclampedWeightGrams: Number(unclampedWeightGrams.toFixed(1)),
    maxWeightG: foodInfo.maxWeightG,
    weightGrams: Number(weightGrams.toFixed(1)),
    capped,
  });

  return {
    weightGrams,
    calories: scale * foodInfo.caloriesPer100g,
    protein: scale * foodInfo.proteinPer100g,
    carbs: scale * foodInfo.carbsPer100g,
    fat: scale * foodInfo.fatPer100g,
    fiber: scale * foodInfo.fiberPer100g,
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
    },
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
