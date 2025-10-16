import { format } from "date-fns";
import { Bot, User, Settings } from "lucide-react";
import { MessageContent } from "./components/message-content";
import { MessageActions } from "./components/message-actions";
import { useChatStore, type Message } from "@renderer/stores";
import {
  Message as AIMessage,
  MessageContent as AIMessageContent,
  MessageAvatar
} from "@renderer/components/ai-elements/message";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const currentSession = useChatStore((state) => {
    const current = state.sessions.find((s) => s.id === state.currentSessionId);
    return current || null;
  });

  const hasContent = typeof message.content === "string" && message.content.trim().length > 0;
  const isPending = Boolean((message.isLoading || message.isStreaming) && !hasContent);

  if (message.role === "user") {
    return (
      <AIMessage from="user" className="justify-end">
        {/* 操作按钮 - 在用户消息左侧 */}
        <MessageActions message={message} currentSession={currentSession} position="left" />

        {/* 消息内容 */}
        <AIMessageContent variant="contained">
          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
          <div className="mt-1 text-xs opacity-70">{format(message.timestamp, "HH:mm")}</div>
        </AIMessageContent>

        {/* 用户头像 */}
        <MessageAvatar src="" name="User">
          <User className="h-4 w-4" />
        </MessageAvatar>
      </AIMessage>
    );
  }

  // System 消息 - 显示为系统提示
  if (message.role === "system") {
    return (
      <div className="flex justify-center">
        <div className="bg-muted/50 border-muted-foreground/20 max-w-[90%] rounded-lg border px-3 py-2">
          <div className="flex items-center gap-2">
            <Settings className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-xs font-medium">系统提示</span>
          </div>
          <div className="text-muted-foreground mt-1 text-sm whitespace-pre-wrap">{message.content}</div>
        </div>
      </div>
    );
  }

  // AI 消息
  return (
    <AIMessage from="assistant" className="justify-start">
      {/* AI 头像 */}
      <MessageAvatar src="" name="AI">
        <Bot className="h-4 w-4" />
      </MessageAvatar>

      {/* 消息内容 */}
      <AIMessageContent variant="contained">
        <MessageContent message={message} />
        {!isPending && <div className="text-muted-foreground mt-1 text-xs">{format(message.timestamp, "HH:mm")}</div>}
      </AIMessageContent>

      {/* 操作按钮 - 在AI消息右侧 */}
      {!isPending && <MessageActions message={message} currentSession={currentSession} position="right" />}
    </AIMessage>
  );
}
