import { useState, useCallback } from "react";
import { useDocument, DocumentData } from "@/hooks/use-document";

export function useFileProcessor(onProcessComplete?: (data: DocumentData) => void) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { readAsBase64 } = useDocument();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    try {
      const data = await readAsBase64(file);
      console.log("File processed successfully:", file.name);
      console.log("Base64 string snippet:", data.base64.substring(0, 50) + "...");
      onProcessComplete?.(data);
    } catch (err: any) {
      setError(err.message || "Failed to process document");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [readAsBase64, onProcessComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  return {
    isDragging,
    isProcessing,
    error,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput
  };
}