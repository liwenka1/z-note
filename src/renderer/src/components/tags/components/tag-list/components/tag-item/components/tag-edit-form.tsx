import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { useUpdateTag } from "@renderer/hooks/mutations";
import type { Tag } from "@renderer/types";

interface TagEditFormProps {
  tag: Tag;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TagEditForm({ tag, onSuccess, onCancel }: TagEditFormProps) {
  const [name, setName] = useState(tag.name);
  const [isLoading, setIsLoading] = useState(false);
  const updateTag = useUpdateTag();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) return;

    setIsLoading(true);
    try {
      await updateTag.mutateAsync({
        id: tag.id,
        data: { name: trimmedName }
      });
      onSuccess();
    } catch (error) {
      console.error("更新标签失败:", error);
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
    <form onSubmit={handleSubmit} className="flex gap-2 p-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="标签名称"
        autoFocus
        disabled={isLoading}
        className="h-8 text-sm"
      />
      <div className="flex gap-1">
        <Button type="submit" size="sm" className="h-8 px-3" disabled={isLoading || !name.trim()}>
          保存
        </Button>
        <Button type="button" variant="outline" size="sm" className="h-8 px-3" onClick={onCancel} disabled={isLoading}>
          取消
        </Button>
      </div>
    </form>
  );
}
