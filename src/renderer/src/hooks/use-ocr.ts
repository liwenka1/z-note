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
      // OCR 成功时返回 OCRResult，失败时抛出异常（由 BaseResponse 处理）
      const result = await ocrApi.processImage(imagePath, options);

      setState({
        isLoading: false,
        result,
        error: null
      });

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
