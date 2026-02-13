/**
 * NutriScan Inference Worker
 * Runs YOLOv8 segmentation model in Web Worker to prevent UI blocking
 * Handles image preprocessing, ONNX inference, NMS, mask generation, and calorie calculation
 */

import * as ort from "onnxruntime-web";
import type {
  WorkerRequest,
  WorkerResponse,
  InferenceResult,
  RawDetection,
} from "../lib/inference/types";
import { preprocessImage } from "../lib/inference/preprocessing";
import { applyNMS } from "../lib/inference/nms";
import { processDetections } from "../lib/inference/postprocessing";
import { INFERENCE_CONFIG, APP_BASE_URL } from "../lib/constants";

// ============================================================================
// Global State (Singleton Pattern)
// ============================================================================

let session: ort.InferenceSession | null = null;
let isInitializing = false;
let initError: Error | null = null;

// ============================================================================
// Session Initialization
// ============================================================================

/**
 * Initialize ONNX Runtime session (lazy loading, singleton pattern)
 * Only loads model on first inference request
 */
async function initializeSession(): Promise<void> {
  // Already initialized
  if (session) return;

  // Currently initializing - wait for it to finish
  if (isInitializing) {
    await waitForInitialization();
    return;
  }

  isInitializing = true;

  try {
    console.log("[Worker] Initializing ONNX Runtime...");

    // Configure ONNX Runtime WebAssembly backend
    // Use CDN for WASM files as fallback for better compatibility
    ort.env.wasm.wasmPaths =
      "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.1/dist/";
    ort.env.wasm.numThreads = 1; // Start with single thread for compatibility
    ort.env.logLevel = "warning";

    // Create inference session with more compatible settings
    // Use absolute URL for model in worker context
    // Use APP_BASE_URL if set (for production), otherwise use current origin
    const baseUrl = APP_BASE_URL || self.location.origin;
    const modelUrl = new URL(INFERENCE_CONFIG.MODEL_PATH, baseUrl).href;
    session = await ort.InferenceSession.create(modelUrl, {
      executionProviders: ["wasm"], // WebAssembly backend
      graphOptimizationLevel: "basic", // Start with basic optimization
    });

    console.log("[Worker] Session initialized successfully");
  } catch (error) {
    initError = error as Error;
    console.error("[Worker] Session initialization failed:", error);
    console.error("[Worker] Error details:", {
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    throw error;
  } finally {
    isInitializing = false;
  }
}

/**
 * Wait for ongoing initialization to complete
 */
async function waitForInitialization(): Promise<void> {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (!isInitializing) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}

// ============================================================================
// Inference Pipeline
// ============================================================================

/**
 * Run complete inference pipeline
 * @param imageData - Base64 JPEG or ImageBitmap
 * @returns Complete inference result with detections and nutrition
 */
async function runInference(
  imageData: string | ImageBitmap,
): Promise<InferenceResult> {
  const startTime = performance.now();

  // Ensure session is initialized
  if (!session) {
    await initializeSession();
  }

  if (!session) {
    throw new Error("Failed to initialize ONNX session");
  }

  let inputTensor: ort.Tensor | null = null;
  let outputs: ort.InferenceSession.ReturnType | null = null;

  try {
    // Step 1: Preprocess image to tensor
    inputTensor = await preprocessImage(imageData);

    // Step 2: Run ONNX inference
    outputs = await session.run({ images: inputTensor });

    // YOLOv8-seg outputs (custom 32-class model):
    // output0: [1, 68, 8400] - Detection boxes (4) + class scores (32) + mask coefficients (32)
    // output1: [1, 32, 160, 160] - Mask prototypes

    const output0 = outputs.output0; // Detection tensor
    const output1 = outputs.output1; // Mask prototypes

    if (!output0 || !output1) {
      throw new Error("Missing model outputs");
    }

    const output0Data = output0.data as Float32Array;

    // Step 3: Parse YOLO outputs to raw detections
    const rawDetections = parseYOLOOutput(
      output0Data,
      [...output0.dims], // Convert readonly array to mutable
    );

    // Step 4: Apply Non-Maximum Suppression
    const filteredDetections = applyNMS(rawDetections);

    // Step 5: Generate masks and calculate nutrition
    const detections = await processDetections(
      filteredDetections,
      output1.data as Float32Array,
      [...output1.dims], // Convert readonly array to mutable
    );

    // Step 6: Calculate total calories
    const totalCalories = detections.reduce(
      (sum, d) => sum + d.nutrition.calories,
      0,
    );

    const processingTime = performance.now() - startTime;

    console.log(
      `[Worker] Inference complete in ${processingTime.toFixed(0)}ms, ${detections.length} detections`,
    );

    // Return result
    const result: InferenceResult = {
      detections,
      totalCalories,
      processingTime,
      message:
        detections.length === 0
          ? "Aucun aliment détecté. Essayez de vous rapprocher."
          : undefined,
    };

    return result;
  } catch (error) {
    console.error("[Worker] Inference failed:", error);
    throw error;
  } finally {
    // Dispose tensors to free WASM memory
    inputTensor?.dispose();
    if (outputs) {
      for (const key of Object.keys(outputs)) {
        outputs[key]?.dispose?.();
      }
    }
  }
}

/**
 * Parse YOLOv8 segmentation output to raw detections
 * @param data - Output0 tensor data [1, 48, 8400]
 * @param dims - Tensor dimensions
 * @returns Array of raw detections
 */
function parseYOLOOutput(data: Float32Array, dims: number[]): RawDetection[] {
  const [batch, channels, numAnchors] = dims; // [1, 116, 8400]

  // YOLOv8-seg format for our custom model:
  // First 4 channels: bbox (x_center, y_center, width, height)
  // Next 32 channels: class probabilities (32 food classes)
  // Last 32 channels: mask coefficients
  // Total: 4 + 32 + 32 = 68 channels

  const numClasses = 32; // Our food classes
  const numMaskCoeffs = 32;

  const detections: RawDetection[] = [];
  let invalidBoxCount = 0;

  // Iterate over all 8400 anchor points
  for (let i = 0; i < numAnchors; i++) {
    // Extract bounding box (normalized to image size)
    const x = data[i]; // x_center
    const y = data[numAnchors + i]; // y_center
    const w = data[2 * numAnchors + i]; // width
    const h = data[3 * numAnchors + i]; // height

    // Extract class scores (channels 4 to 15)
    const classScores = new Float32Array(numClasses);
    for (let c = 0; c < numClasses; c++) {
      classScores[c] = data[(4 + c) * numAnchors + i];
    }

    // Find best class and confidence
    let maxScore = -Infinity;
    let maxClassId = 0;
    for (let c = 0; c < numClasses; c++) {
      if (classScores[c] > maxScore) {
        maxScore = classScores[c];
        maxClassId = c;
      }
    }

    // Skip low confidence detections early
    if (maxScore < INFERENCE_CONFIG.CONFIDENCE_THRESHOLD) {
      continue;
    }

    // Extract mask coefficients (channels 16 to 47)
    const maskCoeffs = new Float32Array(numMaskCoeffs);
    for (let m = 0; m < numMaskCoeffs; m++) {
      maskCoeffs[m] = data[(4 + numClasses + m) * numAnchors + i];
    }

    // Normalize bbox coordinates to [0, 1]
    const box = {
      x: x / INFERENCE_CONFIG.INPUT_SIZE,
      y: y / INFERENCE_CONFIG.INPUT_SIZE,
      width: w / INFERENCE_CONFIG.INPUT_SIZE,
      height: h / INFERENCE_CONFIG.INPUT_SIZE,
    };

    if (
      !Number.isFinite(box.x) ||
      !Number.isFinite(box.y) ||
      !Number.isFinite(box.width) ||
      !Number.isFinite(box.height) ||
      box.width <= 0 ||
      box.height <= 0 ||
      box.width > 2 ||
      box.height > 2
    ) {
      invalidBoxCount++;
    }

    // Add detection
    detections.push({
      classId: maxClassId,
      confidence: maxScore,
      box,
      maskCoeffs,
    });
  }

  if (invalidBoxCount > 0) {
    console.warn("[Worker] Suspicious boxes detected during parse", {
      invalidBoxCount,
      totalDetections: detections.length,
    });
  }

  return detections;
}

// ============================================================================
// Message Handler
// ============================================================================

/**
 * Handle messages from main thread
 */
self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const request = event.data;
  const { id, type } = request;

  try {
    switch (type) {
      case "INIT":
        // Initialize model
        await initializeSession();
        const response: WorkerResponse = { id, type: "INIT_SUCCESS" };
        self.postMessage(response);
        break;

      case "INFER":
        // Run inference
        if (!request.payload || !request.payload.imageData) {
          throw new Error("Missing imageData in INFER request");
        }
        const result = await runInference(request.payload.imageData);
        const inferResponse: WorkerResponse = {
          id,
          type: "INFER_SUCCESS",
          payload: result,
        };
        self.postMessage(inferResponse);
        break;

      case "TERMINATE":
        // Clean up session
        if (session) {
          await session.release();
          session = null;
        }
        const terminateResponse: WorkerResponse = {
          id,
          type: "TERMINATE_SUCCESS",
        };
        self.postMessage(terminateResponse);
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    // Send error response
    const errorResponse: WorkerResponse = {
      id,
      type: "ERROR",
      payload: { message: (error as Error).message },
    };
    self.postMessage(errorResponse);
  }
};

// Log worker ready
console.log("[Worker] NutriScan inference worker ready");
