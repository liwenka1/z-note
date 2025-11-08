import { useState, useEffect } from "react";
import { Button } from "@renderer/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@renderer/components/ui/dialog";
import { Input } from "@renderer/components/ui/input";
import { Textarea } from "@renderer/components/ui/textarea";
import { Label } from "@renderer/components/ui/label";
import { toast } from "sonner";

interface AddPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (prompt: { name: string; content: string; description?: string; isDefault: boolean }) => void;
}

export function AddPromptDialog({ open, onOpenChange, onSave }: AddPromptDialogProps) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  // 重置表单
  const resetForm = () => {
    setName("");
    setContent("");
    setDescription("");
    setIsDefault(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    onSave({
      name: name.trim(),
      content: content.trim(),
      description: description.trim() || undefined,
      isDefault
    });

    toast.success("Prompt 添加成功");
    resetForm();
    onOpenChange(false);
  };

  // 弹窗关闭时重置表单
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>添加新的 Prompt</DialogTitle>
          <DialogDescription>创建一个新的 AI 对话提示词模板</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名称</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入 Prompt 名称"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述（可选）</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入 Prompt 描述"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">内容</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="输入 Prompt 内容..."
              rows={10}
              required
              className="font-mono text-sm"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isDefault" className="cursor-pointer">
              设为默认 Prompt
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={!name.trim() || !content.trim()}>
              保存
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
