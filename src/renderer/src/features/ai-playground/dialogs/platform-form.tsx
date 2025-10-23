import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { DialogFooter } from "@renderer/components/ui/dialog";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { Textarea } from "@renderer/components/ui/textarea";

/**
 * 平台表单数据接口
 */
export interface PlatformFormData {
  name: string;
  url: string;
  description?: string;
}

/**
 * 平台表单组件（复用组件）
 * 职责：表单渲染和验证，被 Add/Edit Dialog 复用
 */
interface PlatformFormProps {
  initialData?: PlatformFormData;
  onSubmit: (data: PlatformFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function PlatformForm({ initialData, onSubmit, onCancel, submitLabel = "提交" }: PlatformFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [url, setUrl] = useState(initialData?.url || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !url.trim()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      url: url.trim(),
      description: description.trim() || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">
            平台名称 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：ChatGPT"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="url">
            URL 地址 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">描述（可选）</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="简短描述这个 AI 平台..."
            rows={3}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </DialogFooter>
    </form>
  );
}
