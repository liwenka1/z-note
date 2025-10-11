import { useState, useEffect } from "react";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Textarea } from "@renderer/components/ui/textarea";
import { Label } from "@renderer/components/ui/label";
import { X } from "lucide-react";
import { type Prompt } from "@renderer/stores/prompt-store";

interface EditPromptFormProps {
  prompt: Prompt;
  onSave: (updates: Partial<Prompt>) => void;
  onCancel: () => void;
}

export function EditPromptForm({ prompt, onSave, onCancel }: EditPromptFormProps) {
  const [name, setName] = useState(prompt.name);
  const [content, setContent] = useState(prompt.content);
  const [description, setDescription] = useState(prompt.description || "");

  useEffect(() => {
    setName(prompt.name);
    setContent(prompt.content);
    setDescription(prompt.description || "");
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    onSave({
      name: name.trim(),
      content: content.trim(),
      description: description.trim() || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-name">名称</Label>
        <Input
          id="edit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入 Prompt 名称"
          required
        />
      </div>

      <div>
        <Label htmlFor="edit-description">描述（可选）</Label>
        <Input
          id="edit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="输入 Prompt 描述"
        />
      </div>

      <div>
        <Label htmlFor="edit-content">内容</Label>
        <Textarea
          id="edit-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="输入 Prompt 内容..."
          rows={6}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="mr-1 h-3 w-3" />
          取消
        </Button>
        <Button type="submit" disabled={!name.trim() || !content.trim()}>
          保存
        </Button>
      </div>
    </form>
  );
}
