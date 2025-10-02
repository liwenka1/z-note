import { createWorker } from "tesseract.js";
import { fileSystemApi } from "@renderer/api/file-system";
import type { OCROptions, OCRResult, OCRSource, OCRConfig } from "./types";

// 默认配置
const DEFAULT_CONFIG: OCRConfig = {
  defaultLanguage: ["eng"],
  defaultTimeout: 30000
};

/**
 * 从 localStorage 获取语言配置
 */
function getLanguageConfig(): string[] {
  try {
    const lang = localStorage.getItem("tesseractList");
    return lang?.split(",") || DEFAULT_CONFIG.defaultLanguage;
  } catch (error) {
    console.warn("Failed to load language config:", error);
    return DEFAULT_CONFIG.defaultLanguage;
  }
}

/**
 * 创建超时 Promise
 */
function createTimeoutPromise(timeout: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("OCR timeout")), timeout);
  });
}

/**
 * 从文件路径读取数据（使用现有的文件系统 API）
 */
async function readFileData(path: string): Promise<Blob> {
  try {
    // 使用二进制文件读取 API 来读取图片文件
    const arrayBuffer = await fileSystemApi.readBinaryFile(path);
    return new Blob([arrayBuffer]);
  } catch (error) {
    throw new Error(`Failed to read file: ${path} - ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * 执行 OCR 识别
 */
async function performOCR(source: OCRSource, languages: string[]): Promise<{ text: string; confidence: number }> {
  let imageSource: string | Blob | ArrayBuffer;

  // 根据数据源类型准备数据
  switch (source.type) {
    case "file":
      imageSource = await readFileData(source.path);
      break;
    case "blob":
      imageSource = source.data;
      break;
    case "buffer":
      imageSource = source.data;
      break;
    case "url":
      imageSource = source.url;
      break;
    default:
      throw new Error("Unsupported OCR source type");
  }

  // 创建 worker 并执行识别
  const worker = await createWorker(languages);
  try {
    // Tesseract.js 支持多种图像源类型
    const result = await worker.recognize(imageSource as string | Blob);
    return {
      text: result.data.text,
      confidence: result.data.confidence
    };
  } finally {
    await worker.terminate();
  }
}

/**
 * 主要的 OCR 函数
 * @param source 数据源
 * @param options 配置选项
 * @returns OCR 识别结果
 */
export async function ocr(source: OCRSource, options: OCROptions = {}): Promise<OCRResult> {
  const startTime = Date.now();

  try {
    // 获取配置
    const languages = options.language
      ? Array.isArray(options.language)
        ? options.language
        : [options.language]
      : getLanguageConfig();

    const timeout = options.timeout || DEFAULT_CONFIG.defaultTimeout;

    // 执行 OCR 识别（带超时）
    const ocrPromise = performOCR(source, languages);
    const timeoutPromise = createTimeoutPromise(timeout);

    const { text, confidence } = await Promise.race([ocrPromise, timeoutPromise]);

    const processingTime = Date.now() - startTime;

    return {
      text: text.trim(),
      confidence,
      processingTime,
      success: true
    };
  } catch (error) {
    const processingTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      text: "",
      confidence: 0,
      processingTime,
      success: false,
      error: errorMessage
    };
  }
}

// 导出类型
export type { OCROptions, OCRResult, OCRSource, OCRConfig } from "./types";
