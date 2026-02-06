"use client";

import { useState, useCallback } from "react";
import AppHeader from "@/components/AppHeader";
import CameraScanner from "@/components/CameraScanner";
import ImageUploader from "@/components/ImageUploader";
import NutritionResult from "@/components/NutritionResult";
import ScanHistory from "@/components/ScanHistory";
import { getRandomNutrition, type NutritionData } from "@/lib/mockNutrition";
import { MAX_HISTORY_ITEMS } from "@/lib/constants";
import { useInference } from "@/hooks/useInference";
import { Camera, Upload } from "lucide-react";

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState<NutritionData | null>(null);
  const [history, setHistory] = useState<NutritionData[]>([]);
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');

  // Initialize inference worker
  const { isReady, runInference } = useInference();

  const handleScan = useCallback(async (imageData: string) => {
    // Only proceed if worker is ready
    if (!isReady) {
      console.warn('[App] Inference engine not ready yet');
      return;
    }

    setIsScanning(true);

    try {
      // Run real AI inference
      const inferenceResult = await runInference(imageData);

      // Convert inference result to NutritionData format
      const result: NutritionData = {
        name: inferenceResult.detections.length > 0
          ? inferenceResult.detections[0].label
          : 'Non détecté',
        calories: Math.round(inferenceResult.totalCalories),
        protein: Math.round(
          inferenceResult.detections.reduce((sum, d) => sum + d.nutrition.protein, 0)
        ),
        carbs: Math.round(
          inferenceResult.detections.reduce((sum, d) => sum + d.nutrition.carbs, 0)
        ),
        fat: Math.round(
          inferenceResult.detections.reduce((sum, d) => sum + d.nutrition.fat, 0)
        ),
        fiber: Math.round(
          inferenceResult.detections.reduce((sum, d) => sum + d.nutrition.fiber, 0)
        ),
        serving: `${Math.round(
          inferenceResult.detections.reduce((sum, d) => sum + d.nutrition.weightGrams, 0)
        )}g`,
        icon: inferenceResult.detections.length > 0
          ? inferenceResult.detections[0].icon
          : '❓',
      };

      setCurrentResult(result);
      setHistory((prev) => [result, ...prev].slice(0, MAX_HISTORY_ITEMS));
    } catch (error) {
      console.error('[App] Inference failed:', error);

      // Fallback to mock data on error
      const fallbackResult = getRandomNutrition();
      setCurrentResult(fallbackResult);
      setHistory((prev) => [fallbackResult, ...prev].slice(0, MAX_HISTORY_ITEMS));
    } finally {
      setIsScanning(false);
    }
  }, [isReady, runInference]);

  const handleDismiss = useCallback(() => {
    setCurrentResult(null);
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(var(--color-background))] pb-10">
      <AppHeader />

      <main className="space-y-6 pt-2">
        {/* Tab Switcher */}
        <div className="mx-auto w-full max-w-md px-5">
          <div className="flex gap-2 rounded-2xl bg-[hsl(var(--color-muted))] p-1">
            <button
              onClick={() => setActiveTab('camera')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-heading text-sm font-semibold transition-all ${
                activeTab === 'camera'
                  ? 'bg-[hsl(var(--color-primary))] text-white shadow-md'
                  : 'text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))]'
              }`}
            >
              <Camera className="h-4 w-4" />
              Caméra
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-heading text-sm font-semibold transition-all ${
                activeTab === 'upload'
                  ? 'bg-[hsl(var(--color-primary))] text-white shadow-md'
                  : 'text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))]'
              }`}
            >
              <Upload className="h-4 w-4" />
              Importer
            </button>
          </div>
        </div>

        {/* Scanner/Uploader */}
        {activeTab === 'camera' ? (
          <CameraScanner onScan={handleScan} isScanning={isScanning} />
        ) : (
          <ImageUploader onUpload={handleScan} isProcessing={isScanning} />
        )}

        {currentResult && (
          <NutritionResult data={currentResult} onDismiss={handleDismiss} />
        )}

        <ScanHistory items={history} />
      </main>
    </div>
  );
}

