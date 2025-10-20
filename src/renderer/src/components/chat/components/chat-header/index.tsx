import { SessionSelector } from "./components/session-selector";
import { SessionActions } from "./components/session-actions";
import { TagSelector } from "./components/tag-selector";

export function ChatHeader() {
  return (
    <div className="border-border/50 bg-secondary/30 flex h-12 items-center justify-between border-b px-4">
      {/* 左侧：会话选择器 */}
      <div className="flex-1">
        <SessionSelector />
      </div>

      {/* 中间：标签关联 */}
      <div className="flex flex-1 justify-center">
        <TagSelector />
      </div>

      {/* 右侧：会话操作 */}
      <SessionActions />
    </div>
  );
}
