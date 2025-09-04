import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Textarea } from "@renderer/components/ui/textarea";
import { useChatStore } from "@renderer/store/chat-store";

export function ChatInput() {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { getCurrentSession, addMessage, createSession, isTyping } = useChatStore();
  const currentSession = getCurrentSession();

  // 自动调整高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // 聚焦到输入框
  useEffect(() => {
    if (textareaRef.current && !isTyping) {
      textareaRef.current.focus();
    }
  }, [isTyping]);

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
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = input.trim() && !isTyping;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="border-border/50 bg-background border-t p-4"
    >
      <div className="flex items-end gap-2">
        {/* 附件按钮（预留） */}
        <Button variant="ghost" size="sm" className="h-10 w-10 flex-shrink-0 p-0" disabled title="附件功能（开发中）">
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* 输入框 */}
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder={isTyping ? "AI 正在回复中..." : "输入消息... (Shift+Enter 换行)"}
            className="max-h-[120px] min-h-[40px] resize-none pr-12"
            rows={1}
            disabled={isTyping}
          />

          {/* 字符计数（可选显示） */}
          {input.length > 100 && (
            <div className="text-muted-foreground absolute right-12 bottom-2 text-xs">{input.length}</div>
          )}
        </div>

        {/* 发送按钮 */}
        <Button
          onClick={handleSend}
          disabled={!canSend}
          size="sm"
          className="h-10 w-10 flex-shrink-0 p-0"
          title="发送消息"
        >
          {isTyping ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <Send className="h-4 w-4" />
            </motion.div>
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* 提示文本 */}
      <div className="text-muted-foreground mt-2 text-xs">
        {isTyping ? "请等待 AI 回复完成..." : "支持 Markdown 格式，Enter 发送，Shift+Enter 换行"}
      </div>
    </motion.div>
  );
}
