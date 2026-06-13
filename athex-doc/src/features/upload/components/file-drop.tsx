"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { useFileProcessor } from "../hooks/use-file-processor";
import { ProcessingOverlay } from "./processing-overlay";
import { cn } from "@/utils/cn";

interface FileDropProps {
  onProcessComplete?: (data: any) => void;
  className?: string;
}

export function FileDrop({ onProcessComplete, className }: FileDropProps) {
  const {
    isDragging,
    isProcessing,
    error,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput
  } = useFileProcessor(onProcessComplete);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card 
      variant={isDragging ? "feature" : "default"}
      className={cn(
        "relative flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer overflow-hidden min-h-[300px]",
        isDragging ? "border-[var(--color-primary)] bg-[var(--color-surface-soft)]" : "border-[var(--color-hairline)]",
        error ? "border-[var(--color-error)] bg-[var(--color-error)]/5" : "",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileInput}
    >
      {isProcessing && <ProcessingOverlay />}
      
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileInput}
        accept=".pdf,text/plain,text/markdown,text/csv,application/pdf"
      />
      
      <div className="w-12 h-12 rounded-full bg-[var(--color-surface-soft)] flex items-center justify-center mb-6">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L12 16M12 4L8 8M12 4L16 8M4 20L20 20" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <h3 className="font-sans text-[18px] font-medium text-[var(--color-ink)] text-center mb-2">
        Upload Document Matrix
      </h3>
      <p className="font-sans text-[14px] text-[var(--color-muted)] text-center max-w-[300px]">
        Drag & drop or click to upload supported assets (PDF, TXT, MD, CSV).
      </p>

      {error && (
        <p className="mt-4 font-sans text-[14px] font-medium text-[var(--color-error)] text-center">
          {error}
        </p>
      )}
    </Card>
  );
}