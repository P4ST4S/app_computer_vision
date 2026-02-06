"use client";

import type { NutritionData } from "@/lib/mockNutrition";
import { Flame } from "lucide-react";

interface ScanHistoryProps {
  items: NutritionData[];
}

const ScanHistory = ({ items }: ScanHistoryProps) => {
  if (items.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-md px-5">
      <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-[hsl(var(--color-muted-foreground))]">
        Historique des scans
      </h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-2xl border bg-[hsl(var(--color-card))] p-3 transition-colors"
          >
            <span className="text-2xl">{item.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-[hsl(var(--color-foreground))]">{item.name}</p>
              <p className="text-xs text-[hsl(var(--color-muted-foreground))]">{item.serving}</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-[hsl(var(--color-accent))]/10 px-2.5 py-1">
              <Flame className="h-3.5 w-3.5 text-[hsl(var(--color-accent))]" />
              <span className="text-xs font-semibold text-[hsl(var(--color-foreground))]">
                {item.calories}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScanHistory;
