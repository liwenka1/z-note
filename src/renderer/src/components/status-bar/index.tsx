import { useState } from "react";
import { DockToggleButton } from "./components/dock-toggle-button";
import { NoteStatusInfo } from "./components/note-status-info";
import { HelpButton } from "./components/help-button";

export function StatusBar() {
  // 内部状态管理
  const [isDockVisible, setIsDockVisible] = useState(false);

  // 占位函数，保持逻辑结构
  const handleToggleDock = () => {
    // TODO: 实现 dock 切换逻辑
    setIsDockVisible((prev) => !prev);
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
