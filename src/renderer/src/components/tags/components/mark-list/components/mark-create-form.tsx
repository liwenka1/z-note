import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { Textarea } from "@renderer/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select";
import { ImageUpload } from "@renderer/components/ui/image-upload";
import { useCreateMark } from "@renderer/hooks/mutations";
import type { MarkFormData } from "@renderer/types";

interface MarkCreateFormProps {
  tagId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MarkCreateForm({ tagId, onSuccess, onCancel }: MarkCreateFormProps) {
  const [formData, setFormData] = useState<MarkFormData>({
    tagId,
    type: "text",
    content: "",
    url: "",
    desc: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createMark = useCreateMark();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createMark.mutateAsync({
        tagId,
        type: formData.type,
        desc: formData.desc?.trim() || undefined,
        content: formData.content?.trim() || undefined,
        url: formData.url?.trim() || undefined
      });
      onSuccess();
    } catch (error) {
      console.error("创建记录失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  // 处理 OCR 完成
  const handleOCRComplete = (text: string, imagePath: string) => {
    setFormData((prev) => ({
      ...prev,
      type: "image",
      content: text,
      url: imagePath,
      desc: prev.desc || `图片识别 - ${new Date().toLocaleString()}`
    }));
    setError(null);
  };

  // 处理错误
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4" onKeyDown={handleKeyDown}>
      {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {/* 图片上传组件 */}
      <div className="space-y-2">
        <Label>图片上传与识别</Label>
        <ImageUpload
          onOCRComplete={handleOCRComplete}
          onError={handleError}
          disabled={isLoading}
          className="rounded-lg border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">类型</Label>
        <Select
          value={formData.type}
          onValueChange={(value: string) => setFormData((prev) => ({ ...prev, type: value as MarkFormData["type"] }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">文本</SelectItem>
            <SelectItem value="link">链接</SelectItem>
            <SelectItem value="image">图片</SelectItem>
            <SelectItem value="file">文件</SelectItem>
            <SelectItem value="scan">扫描</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="desc">描述</Label>
        <Input
          id="desc"
          value={formData.desc}
          onChange={(e) => setFormData((prev) => ({ ...prev, desc: e.target.value }))}
          placeholder="记录描述"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">内容</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
          placeholder="记录内容"
          rows={4}
          disabled={isLoading}
        />
      </div>

      {formData.type === "link" && (
        <div className="space-y-2">
          <Label htmlFor="url">链接地址</Label>
          <Input
            id="url"
            type="url"
            value={formData.url}
            onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
            placeholder="https://..."
            disabled={isLoading}
          />
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "创建中..." : "创建"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          取消
        </Button>
      </div>
    </form>
  );
}
