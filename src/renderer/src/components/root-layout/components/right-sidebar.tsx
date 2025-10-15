import { ChatPanel } from "@renderer/components/chat";
import { AIPlaygroundPanel } from "@renderer/components/ai-playground";

interface RightSidebarProps {
  rightActivePanel: string | null;
}

export function RightSidebar({ rightActivePanel }: RightSidebarProps) {
  return (
    <div className="bg-secondary/20 border-border/50 h-full border-l">
      {/* 使用 CSS 控制显示/隐藏，保持组件状态 */}
      <div className={`h-full w-full ${rightActivePanel === "chat" ? "block" : "hidden"}`}>
        <ChatPanel />
      </div>
      <div className={`h-full w-full ${rightActivePanel === "playground" ? "block" : "hidden"}`}>
        <AIPlaygroundPanel />
      </div>
      <div className={`h-full w-full ${rightActivePanel === "outline" ? "block" : "hidden"}`}>
        <div className="p-4">
          <h3 className="text-sm font-medium">文档大纲</h3>
          <p className="text-muted-foreground mt-2 text-xs">功能开发中...</p>
        </div>
      </div>
      <div className={`h-full w-full ${rightActivePanel === "stats" ? "block" : "hidden"}`}>
        <div className="p-4">
          <h3 className="text-sm font-medium">统计信息</h3>
          <p className="text-muted-foreground mt-2 text-xs">功能开发中...</p>
        </div>
      </div>
    </div>
  );
}
