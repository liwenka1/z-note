// ==================== OCR 变更 Hooks ====================

import { useMutation } from "@tanstack/react-query";
import { ocrApi, type OCROptions } from "@renderer/api/ocr";
import { ErrorHandler } from "@renderer/lib/error-handler";

interface OCRMutationOptions {
  imagePath: string;
  options?: OCROptions;
}

/**
 * OCR 图片识别 Mutation
 */
export function useOCRMutation() {
  return useMutation({
    mutationFn: async ({ imagePath, options }: OCRMutationOptions) => {
      return await ocrApi.processImage(imagePath, options);
    },
    onSuccess: (result) => {
      ErrorHandler.success("OCR 识别成功", `识别出 ${result.text.length} 个字符`);
    },
    onError: (error) => {
      ErrorHandler.handle(error, "OCR 识别");
    }
  });
}
