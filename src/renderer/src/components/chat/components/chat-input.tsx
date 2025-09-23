import { useState, useRef, useEffect, useCallback } from "react";
import { Send } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Textarea } from "@renderer/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select";
import { useChatStore } from "@renderer/stores/chat-store";
import { useAIConfigStore } from "@renderer/stores/ai-config-store";
import { useAIChat } from "@renderer/hooks/use-ai-chat";
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
  const [isComposing, setIsComposing] = useState(false);

  // AI 配置相关
  const { configs, getCurrentConfig } = useAIConfigStore();
  const [selectedConfigId, setSelectedConfigId] = useState<string>("");

  // 获取当前选中的配置
  const selectedConfig = configs.find((c) => c.id === selectedConfigId) || getCurrentConfig();

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 80,
    maxHeight: 200
  });

  const { addMessage, createSession } = useChatStore();
  const currentSession = useChatStore((state) => {
    const current = state.sessions.find((s) => s.id === state.currentSessionId);
    return current || null;
  });
  const isTyping = useChatStore((state) => state.isTyping);

  // AI Chat Hook
  const {
    sendMessage: sendAIMessage,
    isLoading: isAILoading,
    clearHistory
  } = useAIChat({
    config: selectedConfig!,
    onMessageAdd: (message) => {
      let sessionId = currentSession?.id;
      if (!sessionId) {
        sessionId = createSession();
      }
      addMessage(sessionId, message);
    }
  });

  // 当切换会话时清空 AI 消息历史
  useEffect(() => {
    clearHistory();
  }, [currentSession?.id, clearHistory]);

  // 初始化默认配置
  useEffect(() => {
    if (!selectedConfigId && configs.length > 0) {
      const defaultConfig = getCurrentConfig();
      if (defaultConfig) {
        setSelectedConfigId(defaultConfig.id);
      }
    }
  }, [configs, getCurrentConfig, selectedConfigId]);

  // 聚焦到输入框
  useEffect(() => {
    if (textareaRef.current && !isTyping) {
      textareaRef.current.focus();
    }
  }, [isTyping, textareaRef]);

  const handleSend = () => {
    if (!input.trim() || isTyping || isAILoading || !selectedConfig) return;

    // 使用 AI Chat Hook 发送消息
    sendAIMessage(input.trim());

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

  const canSend = input.trim() && !isTyping && !isAILoading && selectedConfig;

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
              placeholder={isTyping || isAILoading ? "AI 正在回复中..." : "输入消息..."}
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
              disabled={isTyping || isAILoading}
            />
          </div>

          {/* 底部操作栏 */}
          <div className="bg-background flex items-center justify-between rounded-b-xl border-t p-3">
            {/* 左侧：AI 配置选择器 */}
            <div className="flex items-center gap-2">
              <Select
                value={selectedConfigId}
                onValueChange={(value) => setSelectedConfigId(value)}
                disabled={isTyping || isAILoading}
              >
                <SelectTrigger className="h-7 border-none bg-transparent text-xs shadow-none focus:ring-0">
                  <SelectValue>{selectedConfig ? selectedConfig.name : "选择配置"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {configs.map((config) => (
                    <SelectItem key={config.id} value={config.id}>
                      {config.name} ({config.model})
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
