import { Editor } from "@tiptap/react";
import { ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { fileSystemApi } from "@renderer/api/file-system";
import { toast } from "sonner";
import { useState } from "react";

interface MediaControlsProps {
  editor: Editor | null;
}

export function MediaControls({ editor }: MediaControlsProps) {
  const [isUploading, setIsUploading] = useState(false);

  if (!editor) {
    return null;
  }

  const handleImageUpload = async () => {
    // 创建文件选择器
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = false;

    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) return;

      // 验证文件类型
      if (!file.type.startsWith("image/")) {
        toast.error("请选择图片文件");
        return;
      }

      // 验证文件大小（限制 10MB）
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("图片大小不能超过 10MB");
        return;
      }

      try {
        setIsUploading(true);
        toast.loading("正在上传图片...", { id: "image-upload" });

        // 读取文件为 ArrayBuffer
        const buffer = await file.arrayBuffer();

        // 保存图片到本地
        const relativePath = await fileSystemApi.saveImage(buffer, file.name);

        // 转换为自定义协议 URL
        const imageUrl = `z-note-image://${relativePath}`;

        // 插入到编辑器中
        editor.chain().focus().setImage({ src: imageUrl }).run();

        toast.success("图片上传成功", { id: "image-upload" });
      } catch (error) {
        console.error("图片上传失败:", error);
        const errorMessage = error instanceof Error ? error.message : "图片上传失败";
        toast.error(errorMessage, { id: "image-upload" });
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  };

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleImageUpload}
            disabled={isUploading}
            className="h-8 w-max gap-1 px-2"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
            <span className="text-xs">添加图片</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isUploading ? "上传中..." : "添加图片"}</TooltipContent>
      </Tooltip>
    </div>
  );
}
