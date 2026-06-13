import * as React from "react";

export function ProcessingOverlay() {
  return (
    <div className="absolute inset-0 bg-[var(--color-surface-card)]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-[inherit]">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin mb-4" />
      <p className="font-sans text-[16px] font-medium text-[var(--color-ink)]">
        Ingesting Document...
      </p>
    </div>
  );
}