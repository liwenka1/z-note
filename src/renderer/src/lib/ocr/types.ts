export interface OCROptions {
  language?: string | string[]; // 识别语言，默认 ['eng']
  timeout?: number; // 超时时间，默认 30000ms
}

export interface OCRResult {
  text: string; // 识别的文本
  confidence: number; // 置信度 0-100
  processingTime: number; // 处理时间(ms)
  success: boolean; // 是否成功
  error?: string; // 错误信息
}

export type OCRSource =
  | { type: "file"; path: string } // 文件路径（相对于 AppData）
  | { type: "blob"; data: Blob } // Blob 数据
  | { type: "buffer"; data: ArrayBuffer } // 二进制数据
  | { type: "url"; url: string }; // 图片 URL

export interface OCRConfig {
  defaultLanguage: string[];
  defaultTimeout: number;
}
