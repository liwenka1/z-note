import { DockToggleButton } from "./components/dock-toggle-button";
import { NoteStatusInfo } from "./components/note-status-info";
import { HelpButton } from "./components/help-button";
import type { StatusBarProps } from "./types";

export function StatusBar({ onToggleDock, isDockVisible = false }: StatusBarProps) {
  return (
    <div className="border-border bg-secondary/30 text-foreground fixed right-0 bottom-0 left-0 z-50 flex h-6 w-full items-center justify-between border-t px-2 text-xs">
      {/* 左侧：停靠栏切换按钮 */}
      <div className="flex items-center gap-2">
        <DockToggleButton onToggleDock={onToggleDock} isDockVisible={isDockVisible} />
      </div>

      {/* 右侧：当前笔记信息以及帮助按钮 */}
      <div className="flex items-center gap-2">
        <NoteStatusInfo />
        <HelpButton />
      </div>
    </div>
  );
}
