"use client";

interface NutrientBarProps {
  label: string;
  value: number;
  unit: string;
  max: number;
  colorClass: string;
}

const NutrientBar = ({ label, value, unit, max, colorClass }: NutrientBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[hsl(var(--color-foreground))]">{label}</span>
        <span className="text-sm font-semibold text-[hsl(var(--color-foreground))]">
          {value}
          <span className="ml-0.5 text-xs text-[hsl(var(--color-muted-foreground))]">{unit}</span>
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[hsl(var(--color-secondary))]">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default NutrientBar;
