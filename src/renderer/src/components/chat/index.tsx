import { ChatHeader } from "./components/chat-header";
import { ChatMessageList } from "./components/chat-message-list";
import { ChatInput } from "./components/chat-input";
import { EmptyChat } from "./components/empty-chat";
import { useChatState } from "./hooks/use-chat-state";

/**
 * Chat 主组件 - 简洁版本，参考 Cursor 设计
 */
export function ChatPanel() {
  const { hasMessages } = useChatState();

  return (
    <div className="bg-background flex h-full flex-col">
      <ChatHeader />

      <div className="min-h-0 flex-1">{hasMessages ? <ChatMessageList /> : <EmptyChat />}</div>

      <ChatInput />
    </div>
  );
}
