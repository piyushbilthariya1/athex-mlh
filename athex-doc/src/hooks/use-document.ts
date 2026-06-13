import { useCallback } from "react";

export interface DocumentData {
  file: File;
  base64: string;
  mimeType: string;
}

export function useDocument() {
  const readAsBase64 = useCallback((file: File): Promise<DocumentData> => {
    return new Promise((resolve, reject) => {
      // Validate file type
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];
      
      if (!validTypes.includes(file.type)) {
        reject(new Error("Invalid file format. Only PDF, DOCX, and PPTX are supported."));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Extract the base64 part, removing the data URL prefix
        const base64 = result.split(",")[1];
        resolve({
          file,
          base64,
          mimeType: file.type,
        });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }, []);

  return { readAsBase64 };
}