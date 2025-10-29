import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@renderer/components/ui/dialog";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { Textarea } from "@renderer/components/ui/textarea";
import { ImageUpload } from "@renderer/components/ui/image-upload";
import { useCreateMark } from "@renderer/hooks/mutations";

interface ScanMarkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tagId: number;
}

export function ScanMarkDialog({ open, onOpenChange, tagId }: ScanMarkDialogProps) {
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createMark = useCreateMark();

  // 处理图片上传完成
  const handleImageUpload = (imagePath: string, fileName: string) => {
    setUrl(imagePath);
    if (!desc) {
      setDesc(`扫描上传 - ${fileName}`);
    }
    setError(null);
  };

  // 处理 OCR 完成
  const handleOCRComplete = (text: string, imagePath: string) => {
    setContent(text);
    setUrl(imagePath);
    if (!desc) {
      setDesc(`扫描识别 - ${new Date().toLocaleString()}`);
    }
    setError(null);
  };

  // 处理错误
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createMark.mutateAsync({
        tagId,
        type: "scan",
        desc: desc.trim() || undefined,
        url: url.trim() || undefined,
        content: content.trim() || undefined
      });

      // 成功后关闭对话框并重置表单
      onOpenChange(false);
      setDesc("");
      setUrl("");
      setContent("");
      setError(null);
    } catch (error) {
      console.error("创建扫描记录失败:", error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    // 关闭时重置表单
    if (!newOpen) {
      setDesc("");
      setUrl("");
      setContent("");
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>添加扫描记录</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="scan-desc">描述</Label>
            <Input
              id="scan-desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="记录描述"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>图片上传与识别</Label>
            <ImageUpload
              onImageUpload={handleImageUpload}
              onOCRComplete={handleOCRComplete}
              onError={handleError}
              disabled={createMark.isPending}
              className="rounded-lg border"
            />
            <p className="text-muted-foreground text-xs">上传图片后自动进行 OCR 文字识别</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scan-content">识别内容</Label>
            <Textarea
              id="scan-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="OCR 识别的文本内容（自动填充）"
              rows={6}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={createMark.isPending}>
              {createMark.isPending ? "创建中..." : "创建"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
