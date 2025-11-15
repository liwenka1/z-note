// ==================== API 相关类型 ====================

// ==================== AI 相关类型 ====================
export interface AIConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIStreamResponse {
  streamId: string;
  model: string;
}

export interface AIAbortResponse {
  success: boolean;
  streamId: string;
  error?: string;
}

// ==================== OCR 相关类型 ====================

export interface OCROptions {
  language?: string | string[];
  timeout?: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  processingTime: number;
}
