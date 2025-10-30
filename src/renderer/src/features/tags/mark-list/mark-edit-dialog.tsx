import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@renderer/components/ui/dialog";
import { Button } from "@renderer/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select";
import { useUpdateMark } from "@renderer/hooks/mutations";
import { DescField, ContentField, UrlField } from "./components/mark-form-fields";
import type { Mark, MarkFormData } from "@shared/types";

interface MarkEditDialogProps {
  mark: Mark;
  open: boolean;
  onClose: () => void;
}

export function MarkEditDialog({ mark, open, onClose }: MarkEditDialogProps) {
  const [formData, setFormData] = useState({
    tagId: mark.tagId,
    type: mark.type,
    content: mark.content || "",
    url: mark.url || "",
    desc: mark.desc || ""
  });
  const updateMark = useUpdateMark();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      onClose();
    } catch (error) {
      console.error("更新记录失败:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑记录</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">类型</label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as MarkFormData["type"] }))}
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

          <DescField
            value={formData.desc}
            onChange={(value) => setFormData((prev) => ({ ...prev, desc: value }))}
            disabled={updateMark.isPending}
          />

          <ContentField
            value={formData.content}
            onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
            disabled={updateMark.isPending}
          />

          {formData.type === "link" && (
            <UrlField
              value={formData.url}
              onChange={(value) => setFormData((prev) => ({ ...prev, url: value }))}
              disabled={updateMark.isPending}
            />
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={updateMark.isPending}>
              {updateMark.isPending ? "保存中..." : "保存"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={updateMark.isPending}>
              取消
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
