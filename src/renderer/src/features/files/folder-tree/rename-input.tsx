import { useState, useRef, useEffect } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";

interface RenameInputProps {
  initialName: string;
  level: number;
  onRename: (newName: string) => Promise<void>;
  onCancel: () => void;
}

/**
 * 重命名输入框组件
 * 负责处理文件夹重命名的输入和确认逻辑
 */
export function RenameInput({ initialName, level, onRename, onCancel }: RenameInputProps) {
  const [newName, setNewName] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleRename = async () => {
    if (newName.trim() && newName.trim() !== initialName) {
      try {
        await onRename(newName.trim());
      } catch (error) {
        console.error("Failed to rename:", error);
        setNewName(initialName);
      }
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setNewName(initialName);
      onCancel();
    }
  };

  return (
    <div
      className="group flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors duration-200"
      style={{ paddingLeft: `${level * 20 + 8}px` }}
    >
      <div className="flex h-5 w-5 items-center justify-center" />
      <div className="ml-1 h-4 w-4 shrink-0" />

      <div className="min-w-0 flex-1">
        <Input
          ref={inputRef}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleRename}
          className="h-6 px-1 text-sm"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            handleRename();
          }}
        >
          <Check className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            setNewName(initialName);
            onCancel();
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
