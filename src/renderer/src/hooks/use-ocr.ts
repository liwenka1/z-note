import { useState, useCallback } from "react";
import { ocr } from "@renderer/lib/ocr";
import type { OCROptions, OCRResult, OCRSource } from "@renderer/lib/ocr";

export interface UseOCRState {
  isLoading: boolean;
  result: OCRResult | null;
  error: string | null;
}

export interface UseOCRActions {
  performOCR: (source: OCRSource, options?: OCROptions) => Promise<OCRResult>;
  performOCRFromFile: (path: string, options?: OCROptions) => Promise<string>;
  performOCRFromBlob: (blob: Blob, options?: OCROptions) => Promise<string>;
  performOCRFromUrl: (url: string, options?: OCROptions) => Promise<string>;
  reset: () => void;
}

export type UseOCRReturn = UseOCRState & UseOCRActions;

/**
 * OCR Hook - 适用于 Electron 架构
 * 提供 OCR 识别功能的 React Hook
 */
export function useOCR(): UseOCRReturn {
  const [state, setState] = useState<UseOCRState>({
    isLoading: false,
    result: null,
    error: null
  });

  // 通用 OCR 执行函数
  const performOCR = useCallback(async (source: OCRSource, options: OCROptions = {}): Promise<OCRResult> => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const result = await ocr(source, options);

      setState({
        isLoading: false,
        result,
        error: result.success ? null : result.error || "OCR failed"
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      setState({
        isLoading: false,
        result: null,
        error: errorMessage
      });

      throw error;
    }
  }, []);

  // 从文件执行 OCR
  const performOCRFromFile = useCallback(
    async (path: string, options: OCROptions = {}): Promise<string> => {
      const result = await performOCR({ type: "file", path }, options);
      if (!result.success) {
        throw new Error(result.error || "OCR failed");
      }
      return result.text;
    },
    [performOCR]
  );

  // 从 Blob 执行 OCR
  const performOCRFromBlob = useCallback(
    async (blob: Blob, options: OCROptions = {}): Promise<string> => {
      const result = await performOCR({ type: "blob", data: blob }, options);
      if (!result.success) {
        throw new Error(result.error || "OCR failed");
      }
      return result.text;
    },
    [performOCR]
  );

  // 从 URL 执行 OCR
  const performOCRFromUrl = useCallback(
    async (url: string, options: OCROptions = {}): Promise<string> => {
      const result = await performOCR({ type: "url", url }, options);
      if (!result.success) {
        throw new Error(result.error || "OCR failed");
      }
      return result.text;
    },
    [performOCR]
  );

  // 重置状态
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      result: null,
      error: null
    });
  }, []);

  return {
    ...state,
    performOCR,
    performOCRFromFile,
    performOCRFromBlob,
    performOCRFromUrl,
    reset
  };
}
