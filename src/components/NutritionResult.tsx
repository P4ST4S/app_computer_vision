"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Flame, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import NutrientBar from "@/components/NutrientBar";
import type { NutritionData } from "@/lib/mockNutrition";
import { NUTRIENT_LIMITS } from "@/lib/constants";

interface NutritionResultProps {
  items: NutritionData[];
  onDismiss: () => void;
  onRemoveItem: (index: number) => void;
}

const NutritionResult = ({ items, onDismiss, onRemoveItem }: NutritionResultProps) => {
  const totalCalories = items.reduce((sum, i) => sum + i.calories, 0);
  const totalProtein = items.reduce((sum, i) => sum + i.protein, 0);
  const totalCarbs = items.reduce((sum, i) => sum + i.carbs, 0);
  const totalFat = items.reduce((sum, i) => sum + i.fat, 0);
  const totalFiber = items.reduce((sum, i) => sum + i.fiber, 0);

  return (
    <div className="mx-auto w-full max-w-md px-5 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <Card className="overflow-hidden border-2 shadow-lg">
        {/* Total Header */}
        <div className="relative bg-[hsl(var(--color-primary))]/5 px-5 pb-4 pt-5">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 rounded-full"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Total calories */}
          <div className="flex items-center gap-3 rounded-2xl bg-[hsl(var(--color-accent))]/15 px-4 py-3">
            <Flame className="h-7 w-7 text-[hsl(var(--color-accent))]" />
            <div>
              <p className="font-heading text-3xl font-bold text-[hsl(var(--color-foreground))]">
                {totalCalories}
              </p>
              <p className="text-xs font-medium text-[hsl(var(--color-muted-foreground))]">
                Calories totales (kcal)
              </p>
            </div>
          </div>

          {/* Per-item breakdown */}
          <div className="mt-3 space-y-2">
            {items.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex items-center justify-between rounded-xl bg-[hsl(var(--color-background))] px-3 py-2"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[hsl(var(--color-foreground))]">
                      {item.name}
                    </p>
                    <p className="text-xs text-[hsl(var(--color-muted-foreground))]">
                      {item.serving}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-heading text-sm font-bold text-[hsl(var(--color-foreground))]">
                    {item.calories} kcal
                  </p>
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[hsl(var(--color-muted-foreground))] transition-colors hover:bg-[hsl(var(--color-destructive))]/10 hover:text-[hsl(var(--color-destructive))]"
                    aria-label={`Supprimer ${item.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total nutrient bars */}
        <CardContent className="space-y-4 p-5">
          <NutrientBar
            label="Protéines"
            value={totalProtein}
            unit="g"
            max={NUTRIENT_LIMITS.protein}
            colorClass="bg-nutrient-protein"
          />
          <NutrientBar
            label="Glucides"
            value={totalCarbs}
            unit="g"
            max={NUTRIENT_LIMITS.carbs}
            colorClass="bg-nutrient-carbs"
          />
          <NutrientBar
            label="Lipides"
            value={totalFat}
            unit="g"
            max={NUTRIENT_LIMITS.fat}
            colorClass="bg-nutrient-fat"
          />
          <NutrientBar
            label="Fibres"
            value={totalFiber}
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
