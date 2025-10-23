import { NoteStatusInfo } from "./note-status-info";
import { HelpButton } from "./help-button";

export function StatusBar() {
  return (
    <div className="border-border bg-secondary/30 text-foreground fixed right-0 bottom-0 left-0 z-50 flex h-6 w-full items-center justify-end border-t px-2 text-xs">
      {/* 笔记信息以及帮助按钮 */}
      <div className="flex items-center gap-2">
        <NoteStatusInfo />
        <HelpButton />
      </div>
    </div>
  );
}
