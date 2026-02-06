/**
 * Image Preprocessing for YOLOv8 Inference
 * Converts camera frames (base64 JPEG or ImageBitmap) to ONNX tensors
 * Output format: Float32Array in NCHW layout [1, 3, 640, 640]
 */

import * as ort from 'onnxruntime-web';
import { INFERENCE_CONFIG } from '@/lib/constants';

/**
 * Convert base64 data URL or ImageBitmap to ONNX Tensor
 * @param imageData - Base64 JPEG string or ImageBitmap from camera
 * @returns ONNX Tensor in NCHW format [1, 3, 640, 640], normalized to [0, 1]
 */
export async function preprocessImage(
  imageData: string | ImageBitmap
): Promise<ort.Tensor> {
  // Step 1: Decode base64 to ImageBitmap (if needed)
  const bitmap =
    typeof imageData === 'string'
      ? await decodeBase64ToImageBitmap(imageData)
      : imageData;

  // Step 2: Resize to 640x640 (YOLO input size)
  const resized = await resizeImageBitmap(
    bitmap,
    INFERENCE_CONFIG.INPUT_SIZE,
    INFERENCE_CONFIG.INPUT_SIZE
  );

  // Step 3: Extract RGB pixels and convert to tensor
  const tensorData = await bitmapToTensorData(resized);

  // Step 4: Create ONNX tensor
  return new ort.Tensor('float32', tensorData, [
    1,
    3,
    INFERENCE_CONFIG.INPUT_SIZE,
    INFERENCE_CONFIG.INPUT_SIZE,
  ]);
}

/**
 * Decode base64 data URL to ImageBitmap
 * @param base64 - Data URL (e.g., "data:image/jpeg;base64,...")
 * @returns ImageBitmap
 */
async function decodeBase64ToImageBitmap(base64: string): Promise<ImageBitmap> {
  const response = await fetch(base64);
  const blob = await response.blob();
  return createImageBitmap(blob);
}

/**
 * Resize ImageBitmap to target dimensions
 * @param source - Source ImageBitmap
 * @param width - Target width
 * @param height - Target height
 * @returns Resized ImageBitmap
 */
async function resizeImageBitmap(
  source: ImageBitmap,
  width: number,
  height: number
): Promise<ImageBitmap> {
  return createImageBitmap(source, {
    resizeWidth: width,
    resizeHeight: height,
    resizeQuality: 'high',
  });
}

/**
 * Convert ImageBitmap to Float32Array tensor in NCHW format
 * @param bitmap - Resized ImageBitmap (640x640)
 * @returns Float32Array in NCHW format, normalized to [0, 1]
 */
async function bitmapToTensorData(bitmap: ImageBitmap): Promise<Float32Array> {
  const width = bitmap.width;
  const height = bitmap.height;

  // Use OffscreenCanvas if available (worker context), otherwise regular Canvas
  let canvas: OffscreenCanvas | HTMLCanvasElement;
  let ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D | null;

  if (typeof OffscreenCanvas !== 'undefined') {
    canvas = new OffscreenCanvas(width, height);
    ctx = canvas.getContext('2d');
  } else {
    // Fallback for environments without OffscreenCanvas
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');
  }

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Draw bitmap to canvas
  ctx.drawImage(bitmap, 0, 0);

  // Extract RGBA pixel data
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data; // Uint8ClampedArray [R,G,B,A,R,G,B,A,...]

  // Convert to Float32Array in NCHW format
  const inputSize = width * height;
  const tensorData = new Float32Array(3 * inputSize);

  // Separate RGB channels and normalize to [0, 1]
  for (let i = 0; i < inputSize; i++) {
    const pixelIndex = i * 4;

    // Channel 0: Red
    tensorData[i] = pixels[pixelIndex] / 255.0;

    // Channel 1: Green
    tensorData[inputSize + i] = pixels[pixelIndex + 1] / 255.0;

    // Channel 2: Blue
    tensorData[2 * inputSize + i] = pixels[pixelIndex + 2] / 255.0;

    // Alpha channel is ignored
  }

  return tensorData;
}

/**
 * Utility function to log tensor statistics (for debugging)
 * @param tensor - ONNX Tensor to inspect
 */
export function logTensorStats(tensor: ort.Tensor): void {
  const data = tensor.data as Float32Array;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;

  console.log('[Preprocessing] Tensor Stats:', {
    shape: tensor.dims,
    min: min.toFixed(4),
    max: max.toFixed(4),
    mean: mean.toFixed(4),
    size: data.length,
  });
}
