import { ChatPanel } from "@renderer/components/chat";
import { TagsPanel } from "@renderer/components/tags";

interface RightSidebarProps {
  rightActivePanel: string | null;
}

export function RightSidebar({ rightActivePanel }: RightSidebarProps) {
  return (
    <div className="bg-secondary/20 border-border/50 h-full border-l">
      {rightActivePanel === "chat" && <ChatPanel />}
      {rightActivePanel === "tags" && <TagsPanel />}
      {rightActivePanel === "outline" && (
        <div className="p-4">
          <h3 className="text-sm font-medium">文档大纲</h3>
          <p className="text-muted-foreground mt-2 text-xs">功能开发中...</p>
        </div>
      )}
      {rightActivePanel === "stats" && (
        <div className="p-4">
          <h3 className="text-sm font-medium">统计信息</h3>
          <p className="text-muted-foreground mt-2 text-xs">功能开发中...</p>
        </div>
      )}
    </div>
  );
}
