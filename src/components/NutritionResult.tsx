"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Flame, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import NutrientBar from "@/components/NutrientBar";
import type { NutritionData } from "@/lib/mockNutrition";
import { NUTRIENT_LIMITS } from "@/lib/constants";

interface NutritionResultProps {
  data: NutritionData;
  onDismiss: () => void;
}

const NutritionResult = ({ data, onDismiss }: NutritionResultProps) => {
  return (
    <div className="mx-auto w-full max-w-md px-5 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <Card className="overflow-hidden border-2 shadow-lg">
        {/* Header */}
        <div className="relative bg-[hsl(var(--color-primary))]/5 px-5 pb-4 pt-5">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 rounded-full"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{data.icon}</span>
            <div>
              <h2 className="font-heading text-xl font-bold text-[hsl(var(--color-foreground))]">
                {data.name}
              </h2>
              <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                Pour {data.serving}
              </p>
            </div>
          </div>
          {/* Calories badge */}
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[hsl(var(--color-accent))]/15 px-4 py-3">
            <Flame className="h-6 w-6 text-[hsl(var(--color-accent))]" />
            <div>
              <p className="font-heading text-2xl font-bold text-[hsl(var(--color-foreground))]">
                {data.calories}
              </p>
              <p className="text-xs font-medium text-[hsl(var(--color-muted-foreground))]">
                Calories (kcal)
              </p>
            </div>
          </div>
        </div>

        {/* Nutrient bars */}
        <CardContent className="space-y-4 p-5">
          <NutrientBar
            label="Protéines"
            value={data.protein}
            unit="g"
            max={NUTRIENT_LIMITS.protein}
            colorClass="bg-nutrient-protein"
          />
          <NutrientBar
            label="Glucides"
            value={data.carbs}
            unit="g"
            max={NUTRIENT_LIMITS.carbs}
            colorClass="bg-nutrient-carbs"
          />
          <NutrientBar
            label="Lipides"
            value={data.fat}
            unit="g"
            max={NUTRIENT_LIMITS.fat}
            colorClass="bg-nutrient-fat"
          />
          <NutrientBar
            label="Fibres"
            value={data.fiber}
            unit="g"
            max={NUTRIENT_LIMITS.fiber}
            colorClass="bg-nutrient-fiber"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionResult;
