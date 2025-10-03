export interface OCROptions {
  language?: string | string[];
  timeout?: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  processingTime: number;
  success: boolean;
  error?: string;
}
