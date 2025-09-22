import { Plus, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@renderer/components/ui/dropdown-menu";
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
    <div className="border-border/50 flex h-11 items-center justify-between border-b px-4">
      {/* 左侧：会话选择器 */}
      <div className="flex-1">
        <SessionSelector />
      </div>

      {/* 右侧：更多操作菜单 */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleNewSession} title="新建会话">
          <Plus className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="更多选项">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleNewSession}>
              <Plus className="mr-2 h-4 w-4" />
              新建会话
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleClearSession}
              disabled={!currentSession || currentSession.messages.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              清空当前会话
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>设置 (开发中)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
