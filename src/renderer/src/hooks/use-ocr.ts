import { useCallback } from "react";
import { useOCRMutation } from "@renderer/hooks/mutations/use-ocr-mutations";
import type { OCROptions } from "@renderer/api/ocr";

/**
 * OCR Hook - 使用 React Query mutation
 */
export function useOCR() {
  const ocrMutation = useOCRMutation();

  const processImage = useCallback(
    async (imagePath: string, options: OCROptions = {}): Promise<string> => {
      const result = await ocrMutation.mutateAsync({ imagePath, options });
      return result.text;
    },
    [ocrMutation]
  );

  const reset = useCallback(() => {
    ocrMutation.reset();
  }, [ocrMutation]);

  return {
    processImage,
    reset,
    isLoading: ocrMutation.isPending,
    result: ocrMutation.data,
    error: ocrMutation.error?.message || null
  };
}
