"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="p-[var(--spacing-xl)] flex flex-col items-center justify-center h-full gap-4 w-full">
      <div className="w-16 h-16 rounded-full bg-[var(--color-error)]/10 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 className="font-sans font-medium text-[22px] text-[var(--color-ink)]">System Fault Detected</h2>
      <p className="font-sans text-[16px] text-[var(--color-muted)] text-center max-w-[400px]">
        The dashboard encountered an unexpected error. Ensure your documents are valid and try again.
      </p>
      <Button variant="primary" onClick={() => reset()}>
        Restart Workspace
      </Button>
    </div>
  );
}