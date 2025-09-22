import { useState, useRef, useEffect, useCallback } from "react";
import { Send } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Textarea } from "@renderer/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select";
import { useChatStore } from "@renderer/stores/chat-store";
import { cn } from "@renderer/lib/utils";

// 模型选项
const models = [
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5" },
  { id: "claude-3", name: "Claude" }
];

// 自动调整高度的 Hook
function useAutoResizeTextarea({ minHeight, maxHeight }: { minHeight: number; maxHeight?: number }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      // 临时缩小以获得正确的 scrollHeight
      textarea.style.height = `${minHeight}px`;

      // 计算新高度
      const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY));

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    // 设置初始高度
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

export function ChatInput() {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [isComposing, setIsComposing] = useState(false);

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 80,
    maxHeight: 200
  });

  const { getCurrentSession, addMessage, createSession, isTyping } = useChatStore();
  const currentSession = getCurrentSession();

  // 聚焦到输入框
  useEffect(() => {
    if (textareaRef.current && !isTyping) {
      textareaRef.current.focus();
    }
  }, [isTyping, textareaRef]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    let sessionId = currentSession?.id;

    // 如果没有当前会话，创建一个新会话
    if (!sessionId) {
      sessionId = createSession();
    }

    // 添加用户消息
    addMessage(sessionId, {
      role: "user",
      content: input.trim()
    });

    setInput("");
    adjustHeight(true); // 重置高度
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      if (input.trim()) {
        handleSend();
      }
    }
  };

  const canSend = input.trim() && !isTyping;

  return (
    <div className="p-4">
      <div className="w-full">
        <div className="bg-background relative rounded-xl border shadow-sm">
          {/* 主要输入区域 */}
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
              placeholder={isTyping ? "AI 正在回复中..." : "输入消息..."}
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
              style={{
                overflow: "hidden"
              }}
              disabled={isTyping}
            />
          </div>

          {/* 底部操作栏 */}
          <div className="bg-background flex items-center justify-between rounded-b-xl border-t p-3">
            {/* 左侧：模型选择器 */}
            <div className="flex items-center gap-2">
              <Select
                value={selectedModel.id}
                onValueChange={(value) => {
                  const model = models.find((m) => m.id === value);
                  if (model) setSelectedModel(model);
                }}
                disabled={isTyping}
              >
                <SelectTrigger className="h-7 border-none bg-transparent text-xs shadow-none focus:ring-0">
                  <SelectValue>{selectedModel.name}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 右侧：发送按钮 */}
            <div className="flex items-center gap-2">
              <Button onClick={handleSend} disabled={!canSend} size="sm" className="h-8 w-8 p-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
