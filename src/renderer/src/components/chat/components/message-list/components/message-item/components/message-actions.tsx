import { Copy, RotateCcw, Trash } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { useChatStore, type Message, type ChatSession } from "@renderer/stores/chat-store";

interface MessageActionsProps {
  message: Message;
  currentSession: ChatSession | null;
  position: "left" | "right";
}

export function MessageActions({ message, currentSession }: MessageActionsProps) {
  const { deleteMessage } = useChatStore();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      // TODO: 显示复制成功提示
    } catch (error) {
      console.error("复制失败:", error);
    }
  };

  const handleDelete = () => {
    if (currentSession) {
      deleteMessage(currentSession.id, message.id);
    }
  };

  const handleRetry = () => {
    if (currentSession && message.role === "assistant") {
      // TODO: 重新生成消息
      console.log("重新生成消息");
    }
  };

  return (
    <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleCopy} title="复制">
        <Copy className="h-3 w-3" />
      </Button>

      {message.role === "assistant" && (
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleRetry} title="重新生成">
          <RotateCcw className="h-3 w-3" />
        </Button>
      )}

      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleDelete} title="删除">
        <Trash className="h-3 w-3" />
      </Button>
    </div>
  );
}
