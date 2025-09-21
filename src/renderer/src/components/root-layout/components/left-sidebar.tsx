import { FilesPanel } from "@renderer/components/files";

interface LeftSidebarProps {
  activePanel: string | null;
}

export function LeftSidebar({ activePanel }: LeftSidebarProps) {
  const renderActivePanel = () => {
    switch (activePanel) {
      case "files":
        return <FilesPanel />;
      default:
        return <FilesPanel />;
    }
  };

  return <div className="bg-muted/30 h-full w-full">{renderActivePanel()}</div>;
}
