import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Textarea } from "@renderer/components/ui/textarea";
import { Label } from "@renderer/components/ui/label";
import { Card, CardContent, CardHeader } from "@renderer/components/ui/card";
import { X } from "lucide-react";

interface AddPromptFormProps {
  onSave: (prompt: { name: string; content: string; description?: string }) => void;
  onCancel: () => void;
}

export function AddPromptForm({ onSave, onCancel }: AddPromptFormProps) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");

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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">添加新的 Prompt</h4>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">名称</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入 Prompt 名称"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">描述（可选）</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入 Prompt 描述"
            />
          </div>

          <div>
            <Label htmlFor="content">内容</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="输入 Prompt 内容..."
              rows={6}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
            <Button type="submit" disabled={!name.trim() || !content.trim()}>
              保存
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
