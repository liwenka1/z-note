import { SessionSelector } from "./components/session-selector";
import { SessionActions } from "./components/session-actions";

export function ChatHeader() {
  return (
    <div className="border-border/50 flex h-11 items-center justify-between border-b px-4">
      {/* 左侧：会话选择器 */}
      <div className="flex-1">
        <SessionSelector />
      </div>

      {/* 右侧：会话操作 */}
      <SessionActions />
    </div>
  );
}
