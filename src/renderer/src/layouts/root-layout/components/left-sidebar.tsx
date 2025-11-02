import { FilesPanel } from "@renderer/features/files";
import { TagsPanel } from "@renderer/features/tags";

interface LeftSidebarProps {
  activePanel: string | null;
}

export function LeftSidebar({ activePanel }: LeftSidebarProps) {
  return (
    <div className="bg-muted/30 border-border/30 h-full w-full border-r">
      {/* 使用 CSS 控制显示/隐藏，保持组件状态 */}
      <div className={`h-full w-full ${activePanel === "files" ? "block" : "hidden"}`}>
        <FilesPanel />
      </div>
      <div className={`h-full w-full ${activePanel === "tags" ? "block" : "hidden"}`}>
        <TagsPanel />
      </div>
    </div>
  );
}
