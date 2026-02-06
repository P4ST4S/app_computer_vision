/**
 * React Hook for NutriScan Inference
 * Manages worker lifecycle and provides a clean API for running inference
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { InferenceWorkerClient } from '@/lib/workerClient';
import type { InferenceResult } from '@/lib/inference/types';

interface UseInferenceReturn {
  /** Whether the worker is ready for inference */
  isReady: boolean;
  /** Whether an inference is currently running */
  isProcessing: boolean;
  /** Current error message, if any */
  error: string | null;
  /** Run inference on an image */
  runInference: (imageData: string) => Promise<InferenceResult>;
  /** Manually reinitialize the worker */
  reinitialize: () => Promise<void>;
}

/**
 * Hook for managing the inference worker
 * Automatically initializes worker on mount and cleans up on unmount
 *
 * @returns Inference state and control functions
 */
export function useInference(): UseInferenceReturn {
  const workerRef = useRef<InferenceWorkerClient | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initAttemptedRef = useRef(false);

  // Initialize worker on mount
  useEffect(() => {
    // Prevent double initialization in strict mode
    if (initAttemptedRef.current) {
      return;
    }
    initAttemptedRef.current = true;

    console.log('[useInference] Initializing worker...');

    // Create worker client
    workerRef.current = new InferenceWorkerClient();

    // Initialize the model
    workerRef.current
      .initialize()
      .then(() => {
        console.log('[useInference] Worker ready');
        setIsReady(true);
        setError(null);
      })
      .catch((err) => {
        console.error('[useInference] Initialization failed:', err);
        setError(err.message || 'Failed to initialize inference engine');
        setIsReady(false);
      });

    // Cleanup on unmount
    return () => {
      console.log('[useInference] Cleaning up worker');
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      setIsReady(false);
    };
  }, []);

  /**
   * Run inference on an image
   */
  const runInference = useCallback(
    async (imageData: string): Promise<InferenceResult> => {
      if (!workerRef.current || !isReady) {
        throw new Error('Worker not ready. Please wait for initialization.');
      }

      setIsProcessing(true);
      setError(null);

      try {
        const result = await workerRef.current.infer(imageData);
        console.log('[useInference] Inference complete:', {
          detections: result.detections.length,
          totalCalories: result.totalCalories.toFixed(0),
          processingTime: result.processingTime.toFixed(0) + 'ms',
        });
        return result;
      } catch (err) {
        const errorMessage = (err as Error).message;
        console.error('[useInference] Inference failed:', errorMessage);
        setError(errorMessage);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [isReady]
  );

  /**
   * Manually reinitialize the worker (useful for error recovery)
   */
  const reinitialize = useCallback(async (): Promise<void> => {
    console.log('[useInference] Reinitializing worker...');

    // Terminate existing worker
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    // Reset state
    setIsReady(false);
    setError(null);
    setIsProcessing(false);

    // Create new worker
    workerRef.current = new InferenceWorkerClient();

    try {
      await workerRef.current.initialize();
      setIsReady(true);
      console.log('[useInference] Worker reinitialized successfully');
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error('[useInference] Reinitialization failed:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    isReady,
    isProcessing,
    error,
    runInference,
    reinitialize,
  };
}
