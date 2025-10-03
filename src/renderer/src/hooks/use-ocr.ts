import { useState, useCallback } from "react";
import { ocrApi, type OCROptions, type OCRResult } from "@renderer/api/ocr";

export interface UseOCRState {
  isLoading: boolean;
  result: OCRResult | null;
  error: string | null;
}

export interface UseOCRActions {
  processImage: (imagePath: string, options?: OCROptions) => Promise<string>;
  reset: () => void;
}

export type UseOCRReturn = UseOCRState & UseOCRActions;

/**
 * OCR Hook - 调用后端服务
 */
export function useOCR(): UseOCRReturn {
  const [state, setState] = useState<UseOCRState>({
    isLoading: false,
    result: null,
    error: null
  });

  // 处理图片 OCR
  const processImage = useCallback(async (imagePath: string, options: OCROptions = {}): Promise<string> => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const result = await ocrApi.processImage(imagePath, options);

      setState({
        isLoading: false,
        result,
        error: result.success ? null : result.error || "OCR 识别失败"
      });

      if (!result.success) {
        throw new Error(result.error || "OCR 识别失败");
      }

      return result.text;
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
    processImage,
    reset
  };
}
