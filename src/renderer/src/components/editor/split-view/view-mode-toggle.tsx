import { Eye, Edit3, Columns2 } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { useEditorStore } from "@renderer/store/editor-store";

const viewModeConfig = [
  {
    mode: "edit" as const,
    icon: Edit3,
    label: "编辑模式",
    tooltip: "仅显示编辑器"
  },
  {
    mode: "split" as const,
    icon: Columns2,
    label: "分屏模式",
    tooltip: "编辑器和预览并排显示"
  },
  {
    mode: "preview" as const,
    icon: Eye,
    label: "预览模式",
    tooltip: "仅显示预览"
  }
];

export function ViewModeToggle() {
  const { viewMode, setViewMode } = useEditorStore();

  return (
    <div className="flex items-center gap-1">
      {viewModeConfig.map(({ mode, icon: Icon, label, tooltip }) => (
        <Tooltip key={mode}>
          <TooltipTrigger asChild>
            <Button
              variant={viewMode === mode ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode(mode)}
              className="h-8 w-8 p-0"
            >
              <Icon className="h-4 w-4" />
              <span className="sr-only">{label}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
