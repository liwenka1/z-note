import { useState, useEffect } from "react";
import { Button } from "@renderer/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@renderer/components/ui/dialog";
import { Input } from "@renderer/components/ui/input";
import { Textarea } from "@renderer/components/ui/textarea";
import { Label } from "@renderer/components/ui/label";
import { type Prompt } from "@renderer/stores";
import { toast } from "sonner";

interface EditPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: Prompt | null;
  onSave: (updates: Partial<Prompt>) => void;
}

export function EditPromptDialog({ open, onOpenChange, prompt, onSave }: EditPromptDialogProps) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");

  // 当 prompt 变化时，更新表单
  useEffect(() => {
    if (prompt) {
      setName(prompt.name);
      setContent(prompt.content);
      setDescription(prompt.description || "");
    }
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    onSave({
      name: name.trim(),
      content: content.trim(),
      description: description.trim() || undefined
    });

    toast.success("Prompt 更新成功");
    onOpenChange(false);
  };

  if (!prompt) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>编辑 Prompt</DialogTitle>
          <DialogDescription>修改你的 AI 对话提示词模板</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">名称</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入 Prompt 名称"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">描述（可选）</Label>
            <Input
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入 Prompt 描述"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-content">内容</Label>
            <Textarea
              id="edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="输入 Prompt 内容..."
              rows={10}
              required
              className="font-mono text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={!name.trim() || !content.trim()}>
              保存更改
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
