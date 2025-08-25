import { FilesPanel } from "@renderer/components/files";
import { TrashPanel } from "@renderer/components/trash";

interface LeftSidebarProps {
  activePanel: string | null;
}

export function LeftSidebar({ activePanel }: LeftSidebarProps) {
  return (
    <div className="bg-secondary/20 border-border/50 h-full border-r">
      {activePanel === "files" && <FilesPanel />}
      {activePanel === "trash" && <TrashPanel />}
    </div>
  );
}
