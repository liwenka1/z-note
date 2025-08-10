import { Save, RotateCcw, Settings } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { Separator } from "@renderer/components/ui/separator";
import { ViewModeToggle } from "../split-view/view-mode-toggle";
import { FormatButtons } from "./format-buttons";

interface EditorToolbarProps {
  isModified: boolean;
  onSave: () => void;
  onReset: () => void;
  onOpenSettings?: () => void;
}

export function EditorToolbar({ isModified, onSave, onReset, onOpenSettings }: EditorToolbarProps) {
  return (
    <div className="border-border bg-background flex h-10 items-center justify-between border-b px-3">
      <div className="flex items-center gap-2">
        {/* 保存和重置按钮 */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onSave} disabled={!isModified} className="h-8 px-2">
                <Save className="mr-1 h-4 w-4" />
                保存
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>保存更改 (Ctrl+S)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onReset} disabled={!isModified} className="h-8 px-2">
                <RotateCcw className="mr-1 h-4 w-4" />
                重置
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>重置到上次保存的状态</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* 格式化按钮 */}
        <FormatButtons />
      </div>

      <div className="flex items-center gap-2">
        {/* 视图模式切换 */}
        <ViewModeToggle />

        <Separator orientation="vertical" className="h-6" />

        {/* 设置按钮 */}
        {onOpenSettings && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onOpenSettings} className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>编辑器设置</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
