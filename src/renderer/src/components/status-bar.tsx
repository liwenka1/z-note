import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { PanelLeftClose, HelpCircle } from "lucide-react";

interface StatusBarProps {
  onToggleDock?: () => void;
  isDockVisible?: boolean;
}

export function StatusBar({ onToggleDock, isDockVisible = false }: StatusBarProps) {
  // 暂时不需要获取笔记数据，使用固定值

  return (
    <div className="border-border bg-secondary/30 text-foreground fixed right-0 bottom-0 left-0 z-50 flex h-6 w-full items-center justify-between border-t px-2 text-xs">
      {/* 左侧：停靠栏切换按钮和文字 */}
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

      {/* 右侧：字符数和帮助按钮 */}
      <div className="flex items-center gap-2">
        <span>字符 123</span>
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
