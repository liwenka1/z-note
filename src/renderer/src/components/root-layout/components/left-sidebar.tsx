import { FilesPanel } from "@renderer/components/files";
// import { SearchCommand } from "@renderer/components/search-command";

interface LeftSidebarProps {
  activePanel: string | null;
}

export function LeftSidebar({ activePanel }: LeftSidebarProps) {
  const renderActivePanel = () => {
    switch (activePanel) {
      case "files":
        return <FilesPanel />;
      // case "search":
      //   return <SearchCommand />;
      default:
        return <FilesPanel />;
    }
  };

  return <div className="bg-muted/30 h-full w-full">{renderActivePanel()}</div>;
}
