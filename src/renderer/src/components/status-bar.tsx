import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { PanelLeftClose, HelpCircle } from "lucide-react";
import { useTabStore } from "@renderer/store/tab-store";
import { useNotesStore } from "@renderer/store";
import { useEditorStore } from "@renderer/store/editor-store";

interface StatusBarProps {
  onToggleDock?: () => void;
  isDockVisible?: boolean;
}

export function StatusBar({ onToggleDock, isDockVisible = false }: StatusBarProps) {
  const { activeTabId } = useTabStore();
  const { notes } = useNotesStore();
  const { getEditingContent, isNoteModified } = useEditorStore();

  // 获取当前活跃笔记信息
  const currentNote = activeTabId ? notes.find((note) => note.id === activeTabId) : null;
  const editingContent = activeTabId ? getEditingContent(activeTabId) : null;
  const isModified = activeTabId ? isNoteModified(activeTabId) : false;
  const characterCount = editingContent?.length || 0;

  return (
    <div className="border-border bg-secondary/30 text-foreground fixed right-0 bottom-0 left-0 z-50 flex h-6 w-full items-center justify-between border-t px-2 text-xs">
      {/* 左侧：停靠栏切换按钮 */}
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onToggleDock} className="hover:bg-secondary/50 h-5 w-5 p-0">
              <PanelLeftClose className={`h-3 w-3 transition-transform ${isDockVisible ? "" : "rotate-180"}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>显示/隐藏停靠栏</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* 右侧：当前笔记信息以及帮助按钮 */}
      <div className="flex items-center gap-2">
        <div className="text-muted-foreground flex items-center gap-4">
          {currentNote ? (
            <>
              <span>笔记: {currentNote.title}</span>
              <span>•</span>
              <span>字符数: {characterCount}</span>
              <span>•</span>
              <span>状态: {isModified ? "未保存" : "已保存"}</span>
            </>
          ) : (
            <span>未选择笔记</span>
          )}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="hover:bg-secondary/50 h-5 w-5 p-0">
              <HelpCircle className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>帮助</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
