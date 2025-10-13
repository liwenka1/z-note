import { FilesPanel } from "@renderer/components/files";
import { TagsPanel } from "@renderer/components/tags";

interface LeftSidebarProps {
  activePanel: string | null;
}

export function LeftSidebar({ activePanel }: LeftSidebarProps) {
  return (
    <div className="bg-muted/30 h-full w-full">
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
