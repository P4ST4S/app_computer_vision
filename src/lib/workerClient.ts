/**
 * Worker Client for NutriScan Inference
 * Provides a clean Promise-based API for communicating with the inference worker
 */

import type { InferenceResult } from './inference/types';

/**
 * Client for communicating with the inference Web Worker
 * Manages worker lifecycle, message routing, and promise-based responses
 */
export class InferenceWorkerClient {
  private worker: Worker | null = null;
  private messageId = 0;
  private pendingRequests = new Map<
    string,
    {
      resolve: (value: any) => void;
      reject: (error: Error) => void;
      timeout?: NodeJS.Timeout;
    }
  >();

  /**
   * Create a new worker client and initialize the worker
   */
  constructor() {
    this.initWorker();
  }

  /**
   * Initialize the Web Worker and set up message handlers
   */
  private initWorker() {
    try {
      // Create worker from worker file
      this.worker = new Worker(
        new URL('../workers/inference.worker.ts', import.meta.url),
        { type: 'module' }
      );

      // Handle messages from worker
      this.worker.onmessage = (event: MessageEvent) => {
        const { id, type, payload } = event.data;

        const pending = this.pendingRequests.get(id);
        if (!pending) {
          console.warn('[WorkerClient] Received response for unknown request:', id);
          return;
        }

        // Clear timeout
        if (pending.timeout) {
          clearTimeout(pending.timeout);
        }

        // Remove from pending
        this.pendingRequests.delete(id);

        // Handle response
        if (type === 'ERROR') {
          pending.reject(new Error(payload.message));
        } else {
          pending.resolve(payload);
        }
      };

      // Handle worker errors
      this.worker.onerror = (error) => {
        console.error('[WorkerClient] Worker error:', error);

        // Reject all pending requests
        this.pendingRequests.forEach((pending) => {
          if (pending.timeout) clearTimeout(pending.timeout);
          pending.reject(new Error('Worker crashed'));
        });
        this.pendingRequests.clear();
      };

      console.log('[WorkerClient] Worker initialized');
    } catch (error) {
      console.error('[WorkerClient] Failed to create worker:', error);
      throw error;
    }
  }

  /**
   * Send a message to the worker and wait for response
   * @param type - Message type
   * @param payload - Message payload (optional)
   * @param timeoutMs - Timeout in milliseconds (default: 30000)
   * @returns Promise that resolves with worker response
   */
  private sendMessage<T>(
    type: string,
    payload?: any,
    timeoutMs: number = 30000
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Worker not initialized'));
        return;
      }

      // Generate unique message ID
      const id = `${this.messageId++}`;

      // Set up timeout
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Worker request timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      // Store pending request
      this.pendingRequests.set(id, { resolve, reject, timeout });

      // Send message to worker
      this.worker.postMessage({ id, type, payload });
    });
  }

  /**
   * Initialize the ONNX model in the worker
   * @returns Promise that resolves when model is loaded
   */
  async initialize(): Promise<void> {
    return this.sendMessage<void>('INIT', undefined, 10000); // 10s timeout for model loading
  }

  /**
   * Run inference on an image
   * @param imageData - Base64 JPEG string from camera
   * @returns Promise that resolves with inference results
   */
  async infer(imageData: string): Promise<InferenceResult> {
    return this.sendMessage<InferenceResult>('INFER', { imageData }, 30000); // 30s timeout
  }

  /**
   * Terminate the worker and clean up resources
   */
  terminate(): void {
    if (this.worker) {
      // Send terminate message (best effort, don't wait)
      try {
        this.worker.postMessage({ id: 'cleanup', type: 'TERMINATE' });
      } catch (error) {
        console.warn('[WorkerClient] Failed to send TERMINATE message:', error);
      }

      // Terminate worker
      this.worker.terminate();
      this.worker = null;
    }

    // Clear all pending requests
    this.pendingRequests.forEach((pending) => {
      if (pending.timeout) clearTimeout(pending.timeout);
      pending.reject(new Error('Worker terminated'));
    });
    this.pendingRequests.clear();

    console.log('[WorkerClient] Worker terminated');
  }

  /**
   * Check if worker is ready
   */
  isReady(): boolean {
    return this.worker !== null;
  }

  /**
   * Get number of pending requests
   */
  getPendingCount(): number {
    return this.pendingRequests.size;
  }
}
