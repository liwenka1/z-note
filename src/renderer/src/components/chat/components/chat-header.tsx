import { Plus, Trash2, Settings } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { SessionSelector } from "./session-selector";
import { useChatStore } from "@renderer/stores/chat-store";

export function ChatHeader() {
  const { createSession, clearSession, getCurrentSession } = useChatStore();
  const currentSession = getCurrentSession();

  const handleNewSession = () => {
    createSession();
  };

  const handleClearSession = () => {
    if (currentSession) {
      clearSession(currentSession.id);
    }
  };

  return (
    <div className="border-border/50 bg-secondary/30 flex h-11 items-center justify-between border-b px-4">
      {/* 左侧：会话信息 */}
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium">AI 助手</h3>
        <div className="h-2 w-2 rounded-full bg-green-500" title="在线" />
      </div>

      {/* 中间：会话选择器 */}
      <div className="flex-1 px-4">
        <SessionSelector />
      </div>

      {/* 右侧：操作按钮 */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleNewSession} title="新建会话">
          <Plus className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={handleClearSession}
          disabled={!currentSession || currentSession.messages.length === 0}
          title="清空当前会话"
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="设置">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
