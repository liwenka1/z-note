import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { Textarea } from "@renderer/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select";
import { useUpdateMark } from "@renderer/hooks/mutations";
import type { Mark, MarkFormData } from "@shared/types";

interface MarkEditFormProps {
  mark: Mark;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MarkEditForm({ mark, onSuccess, onCancel }: MarkEditFormProps) {
  const [formData, setFormData] = useState<MarkFormData>({
    tagId: mark.tagId,
    type: mark.type,
    content: mark.content || "",
    url: mark.url || "",
    desc: mark.desc || ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const updateMark = useUpdateMark();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateMark.mutateAsync({
        id: mark.id,
        data: {
          type: formData.type,
          desc: formData.desc?.trim() || undefined,
          content: formData.content?.trim() || undefined,
          url: formData.url?.trim() || undefined
        }
      });
      onSuccess();
    } catch (error) {
      console.error("更新记录失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" onKeyDown={handleKeyDown}>
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
          {isLoading ? "保存中..." : "保存"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          取消
        </Button>
      </div>
    </form>
  );
}
