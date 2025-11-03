import { Editor, useEditorState } from "@tiptap/react";
import { Highlighter, X } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@renderer/components/ui/tabs";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { cn } from "@renderer/lib/utils";
import { useEditorActiveState } from "../../../hooks/use-editor-active-state";
import { HIGHLIGHT_COLORS } from "../../constants/color-presets";
import { useState } from "react";

interface HighlightDropdownProps {
  editor: Editor | null;
}

export function HighlightDropdown({ editor }: HighlightDropdownProps) {
  const editorState = useEditorActiveState(editor);
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#FEF08A"); // 默认浅黄色

  // 使用 useEditorState 实时监听光标位置的背景色变化
  const currentHighlight = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return "";
      return ctx.editor.getAttributes("highlight").color || "";
    }
  });

  if (!editor) {
    return null;
  }

  const setHighlight = (color: string) => {
    if (color) {
      editor.chain().focus().setHighlight({ color }).run();
    } else {
      editor.chain().focus().unsetHighlight().run();
    }
  };

  const applyCustomHighlight = () => {
    setHighlight(customColor);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn("relative h-8 w-8 p-0", editorState.isHighlight && "bg-secondary")}
            >
              <Highlighter className="h-4 w-4" />
              {/* 显示当前背景色 */}
              {currentHighlight && (
                <div
                  className="absolute bottom-0.5 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full"
                  style={{ backgroundColor: currentHighlight }}
                />
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>背景高亮</TooltipContent>
      </Tooltip>
      <PopoverContent className="w-64 p-0" align="start">
        <Tabs defaultValue="preset" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preset">预设</TabsTrigger>
            <TabsTrigger value="custom">自定义</TabsTrigger>
          </TabsList>

          {/* 预设颜色 */}
          <TabsContent value="preset" className="space-y-3 p-3">
            <div className="grid grid-cols-5 gap-2">
              {HIGHLIGHT_COLORS.map((item) => (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        setHighlight(item.value);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded border-2 transition-all hover:scale-110",
                        currentHighlight === item.value ? "border-primary ring-primary/20 ring-2" : "border-border"
                      )}
                      style={{
                        backgroundColor: item.displayColor
                      }}
                    >
                      {!item.value && <X className="text-muted-foreground h-3 w-3" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{item.name}</TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* 快速清除按钮 */}
            {currentHighlight && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setHighlight("");
                  setIsOpen(false);
                }}
                className="w-full"
              >
                <X className="mr-2 h-4 w-4" />
                清除高亮
              </Button>
            )}
          </TabsContent>

          {/* 自定义颜色 */}
          <TabsContent value="custom" className="space-y-3 p-3">
            <div className="space-y-2">
              <Label>选择背景色</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded border"
                />
                <Input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  placeholder="#FEF08A"
                  className="flex-1"
                />
              </div>
              <p className="text-muted-foreground text-xs">💡 建议使用浅色系背景色</p>
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={applyCustomHighlight} className="flex-1">
                应用
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsOpen(false)} className="flex-1">
                取消
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
