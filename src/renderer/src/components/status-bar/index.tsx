import { useLayoutState } from "@renderer/components/root-layout/hooks/use-layout-state";
import { DockToggleButton } from "./components/dock-toggle-button";
import { NoteStatusInfo } from "./components/note-status-info";
import { HelpButton } from "./components/help-button";

export function StatusBar() {
  const { leftSidebarVisible, rightSidebarVisible, toggleLeftSidebar, toggleRightSidebar } = useLayoutState();

  // Dock 可见性：任一侧边栏可见即为可见
  const isDockVisible = leftSidebarVisible || rightSidebarVisible;

  const handleToggleDock = () => {
    // 如果都隐藏，则显示左侧边栏
    // 如果有任一可见，则全部隐藏
    if (!isDockVisible) {
      toggleLeftSidebar();
    } else {
      if (leftSidebarVisible) toggleLeftSidebar();
      if (rightSidebarVisible) toggleRightSidebar();
    }
  };
  return (
    <div className="border-border bg-secondary/30 text-foreground fixed right-0 bottom-0 left-0 z-50 flex h-6 w-full items-center justify-between border-t px-2 text-xs">
      {/* 左侧：停靠栏切换按钮 */}
      <div className="flex items-center gap-2">
        <DockToggleButton onToggleDock={handleToggleDock} isDockVisible={isDockVisible} />
      </div>

      {/* 右侧：当前笔记信息以及帮助按钮 */}
      <div className="flex items-center gap-2">
        <NoteStatusInfo />
        <HelpButton />
      </div>
    </div>
  );
}
