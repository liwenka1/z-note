import { Plus, Trash2, Settings } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { SessionSelector } from "./session-selector";
import { useChatStore } from "@renderer/store/chat-store";
import { CHAT_CLASSES, CHAT_CONSTANTS } from "../constants/chat";

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
    <div className={CHAT_CLASSES.HEADER}>
      {/* 左侧：会话信息 */}
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium">{CHAT_CONSTANTS.AI_ASSISTANT_NAME}</h3>
        <div className={`${CHAT_CONSTANTS.STATUS_INDICATOR_SIZE} rounded-full bg-green-500`} title="在线" />
      </div>

      {/* 中间：会话选择器 */}
      <div className="flex-1 px-4">
        <SessionSelector />
      </div>

      {/* 右侧：操作按钮 */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className={CHAT_CLASSES.BUTTON_ICON}
          onClick={handleNewSession}
          title="新建会话"
        >
          <Plus className={CHAT_CONSTANTS.ICON_SIZE} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={CHAT_CLASSES.BUTTON_ICON}
          onClick={handleClearSession}
          disabled={!currentSession || currentSession.messages.length === 0}
          title="清空当前会话"
        >
          <Trash2 className={CHAT_CONSTANTS.ICON_SIZE} />
        </Button>

        <Button variant="ghost" size="sm" className={CHAT_CLASSES.BUTTON_ICON} title="设置">
          <Settings className={CHAT_CONSTANTS.ICON_SIZE} />
        </Button>
      </div>
    </div>
  );
}
