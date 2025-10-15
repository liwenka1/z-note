import { useState, useEffect } from "react";
import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@renderer/components/ui/dialog";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { Textarea } from "@renderer/components/ui/textarea";
import { useAIPlatformsStore } from "@renderer/stores";
import type { AIPlatform } from "../constants/ai-platforms";

interface EditPlatformDialogProps {
  platform: AIPlatform;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPlatformDialog({ platform, open, onOpenChange }: EditPlatformDialogProps) {
  const [name, setName] = useState(platform.name);
  const [url, setUrl] = useState(platform.url);
  const [description, setDescription] = useState(platform.description || "");
  const updatePlatform = useAIPlatformsStore((state) => state.updatePlatform);

  // 当对话框打开或平台改变时，重置表单
  useEffect(() => {
    if (open) {
      setName(platform.name);
      setUrl(platform.url);
      setDescription(platform.description || "");
    }
  }, [open, platform]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !url.trim()) {
      return;
    }

    updatePlatform(platform.id, {
      name: name.trim(),
      url: url.trim(),
      description: description.trim() || undefined
    });

    onOpenChange(false);
  };

  const handleCancel = () => {
    setName(platform.name);
    setUrl(platform.url);
    setDescription(platform.description || "");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>编辑 AI 平台</DialogTitle>
            <DialogDescription>修改平台的信息</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">
                平台名称 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：ChatGPT"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-url">
                URL 地址 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">描述（可选）</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="简短描述这个 AI 平台..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              取消
            </Button>
            <Button type="submit">保存</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
