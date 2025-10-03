import { createWorker } from "tesseract.js";
import { BaseService } from "./base-service";
import { registerHandler } from "../ipc/registry";
import { IPC_CHANNELS } from "@shared/ipc-channels";
import type { OCROptions, OCRResult } from "@shared/ocr-types";
import * as path from "path";
import { app } from "electron";

/**
 * OCR 服务 - 在主进程中处理图片识别
 */
export class OCRService extends BaseService {
  private worker: Tesseract.Worker | null = null;
  private isInitialized = false;

  /**
   * 初始化 OCR Worker
   */
  private async initializeWorker(languages: string[] = ["eng"]): Promise<void> {
    if (this.isInitialized && this.worker) {
      return;
    }

    try {
      console.log("[OCRService] 初始化 OCR Worker...");
      this.worker = await createWorker(languages);
      this.isInitialized = true;
      console.log("[OCRService] OCR Worker 初始化成功");
    } catch (error) {
      console.error("[OCRService] OCR Worker 初始化失败:", error);
      throw new Error(`OCR Worker 初始化失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 清理 OCR Worker
   */
  private async cleanupWorker(): Promise<void> {
    if (this.worker) {
      try {
        await this.worker.terminate();
        this.worker = null;
        this.isInitialized = false;
        console.log("[OCRService] OCR Worker 已清理");
      } catch (error) {
        console.error("[OCRService] 清理 OCR Worker 失败:", error);
      }
    }
  }

  /**
   * 处理图片 OCR 识别
   */
  async processImage(imagePath: string, options: OCROptions = {}): Promise<OCRResult> {
    const startTime = Date.now();

    try {
      // 构建完整路径
      let fullPath = imagePath;
      if (!path.isAbsolute(imagePath)) {
        // 如果是相对路径，构建完整路径
        fullPath = path.join(app.getPath("userData"), "z-note", imagePath);
      }

      console.log(`[OCRService] 开始处理图片: ${imagePath} -> ${fullPath}`);

      // 获取语言配置
      const languages = options.language
        ? Array.isArray(options.language)
          ? options.language
          : [options.language]
        : ["eng"];

      // 初始化 Worker
      await this.initializeWorker(languages);

      if (!this.worker) {
        throw new Error("OCR Worker 未初始化");
      }

      // 执行 OCR 识别
      const result = await this.worker.recognize(fullPath);
      const processingTime = Date.now() - startTime;

      console.log(`[OCRService] OCR 识别完成，耗时: ${processingTime}ms`);

      return {
        text: result.data.text.trim(),
        confidence: result.data.confidence,
        processingTime,
        success: true
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      console.error(`[OCRService] OCR 识别失败:`, error);

      return {
        text: "",
        confidence: 0,
        processingTime,
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * 注册 OCR 相关的 IPC 处理器
   */
  registerOCRHandlers(): void {
    // OCR 图片处理
    registerHandler(IPC_CHANNELS.OCR.PROCESS_IMAGE, async (imagePath: string, options?: OCROptions) => {
      return await this.processImage(imagePath, options);
    });

    console.log("[OCRService] OCR IPC 处理器注册完成");
  }

  /**
   * 服务清理
   */
  async cleanup(): Promise<void> {
    await this.cleanupWorker();
  }
}
