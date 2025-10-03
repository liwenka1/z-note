import React, { useCallback, useState } from "react";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useOCR } from "@renderer/hooks/use-ocr";
import { fileSystemApi } from "@renderer/api/file-system";

export interface ImageUploadProps {
  onOCRComplete?: (text: string, imagePath: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  accept?: string;
  maxSize?: number; // 最大文件大小（字节）
}

export function ImageUpload({
  onOCRComplete,
  onError,
  disabled = false,
  className = "",
  accept = "image/*",
  maxSize = 10 * 1024 * 1024 // 默认 10MB
}: ImageUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const { processImage } = useOCR();

  // 处理文件选择
  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const file = files[0]; // 只处理第一个文件

      // 验证文件类型
      if (!file.type.startsWith("image/")) {
        onError?.("请选择图片文件");
        return;
      }

      // 验证文件大小
      if (file.size > maxSize) {
        onError?.(`文件大小不能超过 ${Math.round(maxSize / 1024 / 1024)}MB`);
        return;
      }

      try {
        // 1. 上传状态
        setUploadStatus("uploading");
        setStatusMessage("正在上传图片...");

        // 2. 保存图片到本地
        const buffer = await file.arrayBuffer();
        const savedPath = await fileSystemApi.saveImage(buffer, file.name);

        // 3. OCR 处理状态
        setUploadStatus("processing");
        setStatusMessage("正在识别图片内容...");

        // 4. 执行 OCR 识别
        const ocrText = await processImage(savedPath);

        // 5. 成功状态
        setUploadStatus("success");
        setStatusMessage(`识别完成！识别出 ${ocrText.length} 个字符`);

        // 6. 回调通知
        onOCRComplete?.(ocrText, savedPath);

        // 7. 3秒后重置状态
        setTimeout(() => {
          setUploadStatus("idle");
          setStatusMessage("");
        }, 3000);
      } catch (error) {
        console.error("图片处理失败:", error);
        const errorMessage = error instanceof Error ? error.message : "图片处理失败";

        setUploadStatus("error");
        setStatusMessage(errorMessage);
        onError?.(errorMessage);

        // 5秒后重置状态
        setTimeout(() => {
          setUploadStatus("idle");
          setStatusMessage("");
        }, 5000);
      }
    },
    [maxSize, onError, onOCRComplete, processImage]
  );

  // 拖拽处理
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled || uploadStatus !== "idle") return;
      handleFileSelect(e.dataTransfer.files);
    },
    [disabled, uploadStatus, handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // 点击上传
  const handleClick = useCallback(() => {
    if (disabled || uploadStatus !== "idle") return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      handleFileSelect(target.files);
    };
    input.click();
  }, [disabled, uploadStatus, accept, handleFileSelect]);

  // 获取状态图标
  const getStatusIcon = () => {
    switch (uploadStatus) {
      case "uploading":
      case "processing":
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case "error":
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Upload className="h-8 w-8 text-gray-400" />;
    }
  };

  // 获取状态颜色
  const getStatusColor = () => {
    switch (uploadStatus) {
      case "uploading":
      case "processing":
        return "border-blue-300 bg-blue-50";
      case "success":
        return "border-green-300 bg-green-50";
      case "error":
        return "border-red-300 bg-red-50";
      default:
        return disabled ? "border-gray-200 bg-gray-50" : "border-gray-300 hover:border-gray-400";
    }
  };

  const isProcessing = uploadStatus === "uploading" || uploadStatus === "processing";
  const canInteract = !disabled && uploadStatus === "idle";

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 上传区域 */}
      <div
        className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${getStatusColor()} ${canInteract ? "cursor-pointer" : "cursor-not-allowed"} `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        {getStatusIcon()}

        <div className="mt-4">
          <p className="mb-1 text-sm font-medium text-gray-700">
            {isProcessing ? statusMessage : canInteract ? "点击或拖拽图片到此处" : "上传已禁用"}
          </p>

          {uploadStatus === "idle" && (
            <p className="text-xs text-gray-500">
              支持 PNG、JPG、GIF、WebP 等格式，最大 {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          )}

          {uploadStatus === "success" && <p className="text-xs text-green-600">{statusMessage}</p>}

          {uploadStatus === "error" && <p className="text-xs text-red-600">{statusMessage}</p>}
        </div>
      </div>
    </div>
  );
}
