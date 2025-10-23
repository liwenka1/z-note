import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { useCreateTag } from "@renderer/hooks/mutations";

interface TagCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TagCreateForm({ onSuccess, onCancel }: TagCreateFormProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const createTag = useCreateTag();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) return;

    setIsLoading(true);
    try {
      await createTag.mutateAsync({ name: trimmedName, isLocked: false, isPin: false });
      setName("");
      onSuccess();
    } catch (error) {
      console.error("创建标签失败:", error);
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
          创建
        </Button>
        <Button type="button" variant="outline" size="sm" className="h-8 px-3" onClick={onCancel} disabled={isLoading}>
          取消
        </Button>
      </div>
    </form>
  );
}
