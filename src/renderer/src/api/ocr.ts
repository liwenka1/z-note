import { ipcClient, handleResponse } from "./ipc";
import { IPC_CHANNELS } from "@shared/ipc-channels";
import type { OCROptions, OCRResult } from "@shared/ocr-types";

// 重新导出类型，方便其他模块使用
export type { OCROptions, OCRResult };

/**
 * OCR API - 调用后端 OCR 服务
 */
export const ocrApi = {
  /**
   * 处理图片 OCR 识别
   */
  async processImage(imagePath: string, options?: OCROptions): Promise<OCRResult> {
    const response = await ipcClient.invoke(IPC_CHANNELS.OCR.PROCESS_IMAGE, imagePath, options);
    return handleResponse(response) as OCRResult;
  }
};
