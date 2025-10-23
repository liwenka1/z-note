import { useRef, useEffect, useCallback } from "react";
import { Textarea } from "@renderer/components/ui/textarea";
import { cn } from "@renderer/lib/utils";

// 自动调整高度的 Hook
function useAutoResizeTextarea({ minHeight, maxHeight }: { minHeight: number; maxHeight?: number }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        textarea.style.overflowY = "hidden";
        return;
      }

      // 临时缩小以获得正确的 scrollHeight
      textarea.style.height = `${minHeight}px`;

      // 计算新高度
      const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY));

      textarea.style.height = `${newHeight}px`;
      const shouldScroll = maxHeight !== undefined && textarea.scrollHeight > maxHeight;
      textarea.style.overflowY = shouldScroll ? "auto" : "hidden";
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    // 设置初始高度
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
      textarea.style.overflowY = "hidden";
    }
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

interface InputAreaProps {
  input: string;
  setInput: (value: string) => void;
  isComposing: boolean;
  setIsComposing: (composing: boolean) => void;
  onSend: () => void;
  disabled: boolean;
  placeholder: string;
}

export function InputArea({
  input,
  setInput,
  isComposing,
  setIsComposing,
  onSend,
  disabled,
  placeholder
}: InputAreaProps) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 80,
    maxHeight: 200
  });

  // 聚焦到输入框
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled, textareaRef]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      if (input.trim()) {
        onSend();
        adjustHeight(true); // 重置高度
      }
    }
  };

  return (
    <div className="overflow-y-auto">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          adjustHeight();
        }}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-3",
          "resize-none",
          "!bg-background",
          "border-none",
          "text-sm",
          "focus:outline-none",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          "placeholder:text-muted-foreground placeholder:text-sm",
          "min-h-[80px]",
          "rounded-t-xl"
        )}
        disabled={disabled}
      />
    </div>
  );
}
