export interface DocumentMetadata {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
}

export interface DocumentData {
  file: File;
  base64: string;
  mimeType: string;
  metadata?: DocumentMetadata;
}
