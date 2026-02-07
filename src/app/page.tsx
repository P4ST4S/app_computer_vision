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
  const [currentResults, setCurrentResults] = useState<NutritionData[]>([]);
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

      // Merge detections of the same class
      const merged = new Map<string, NutritionData>();
      for (const d of inferenceResult.detections) {
        const existing = merged.get(d.label);
        if (existing) {
          existing.calories += d.nutrition.calories;
          existing.protein += d.nutrition.protein;
          existing.carbs += d.nutrition.carbs;
          existing.fat += d.nutrition.fat;
          existing.fiber += d.nutrition.fiber;
          existing.serving = `${Math.round(
            parseFloat(existing.serving) + d.nutrition.weightGrams
          )}g`;
        } else {
          merged.set(d.label, {
            name: d.label,
            calories: d.nutrition.calories,
            protein: d.nutrition.protein,
            carbs: d.nutrition.carbs,
            fat: d.nutrition.fat,
            fiber: d.nutrition.fiber,
            serving: `${Math.round(d.nutrition.weightGrams)}g`,
            icon: d.icon,
          });
        }
      }

      const results: NutritionData[] = Array.from(merged.values()).map((r) => ({
        ...r,
        calories: Math.round(r.calories),
        protein: Math.round(r.protein),
        carbs: Math.round(r.carbs),
        fat: Math.round(r.fat),
        fiber: Math.round(r.fiber),
      }));

      if (results.length === 0) {
        results.push({
          name: 'Non détecté',
          calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
          serving: '0g', icon: '❓',
        });
      }

      setCurrentResults(results);
      setHistory((prev) => [...results, ...prev].slice(0, MAX_HISTORY_ITEMS));
    } catch (error) {
      console.error('[App] Inference failed:', error);

      // Fallback to mock data on error
      const fallbackResult = getRandomNutrition();
      setCurrentResults([fallbackResult]);
      setHistory((prev) => [fallbackResult, ...prev].slice(0, MAX_HISTORY_ITEMS));
    } finally {
      setIsScanning(false);
    }
  }, [isReady, runInference]);

  const handleRemoveItem = useCallback((index: number) => {
    setCurrentResults((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next;
    });
  }, []);

  const handleDismiss = useCallback(() => {
    setCurrentResults([]);
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

        {currentResults.length > 0 && (
          <NutritionResult items={currentResults} onDismiss={handleDismiss} onRemoveItem={handleRemoveItem} />
        )}

        <ScanHistory items={history} />
      </main>
    </div>
  );
}

