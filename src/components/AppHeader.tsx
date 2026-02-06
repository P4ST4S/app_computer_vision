"use client";

import { ScanLine } from "lucide-react";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

const AppHeader = () => {
  return (
    <header className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--color-primary))]">
          <ScanLine className="h-5 w-5 text-[hsl(var(--color-primary-foreground))]" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold tracking-tight text-[hsl(var(--color-foreground))]">
            {APP_NAME}
          </h1>
          <p className="text-xs text-[hsl(var(--color-muted-foreground))]">{APP_DESCRIPTION}</p>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
