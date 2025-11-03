import { Editor, useEditorState } from "@tiptap/react";
import { Type, X } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@renderer/components/ui/tabs";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { cn } from "@renderer/lib/utils";
import { useState } from "react";
import { TEXT_COLORS } from "../../constants/color-presets";

interface TextColorPickerProps {
  editor: Editor | null;
}

export function TextColorPicker({ editor }: TextColorPickerProps) {
  const [customColor, setCustomColor] = useState("#000000");
  const [isOpen, setIsOpen] = useState(false);

  // 使用 useEditorState 实时监听光标位置的颜色变化
  const currentColor = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return "";
      return ctx.editor.getAttributes("textStyle").color || "";
    }
  });

  if (!editor) return null;

  const setColor = (color: string) => {
    if (color) {
      editor.chain().focus().setColor(color).run();
    } else {
      editor.chain().focus().unsetColor().run();
    }
  };

  const applyCustomColor = () => {
    setColor(customColor);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
              <Type className="h-4 w-4" />
              {/* 显示当前文本颜色 */}
              {currentColor && (
                <div
                  className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2"
                  style={{ backgroundColor: currentColor }}
                />
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>文本颜色</TooltipContent>
      </Tooltip>

      <PopoverContent className="w-64 p-0" align="start">
        <Tabs defaultValue="preset" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preset">预设</TabsTrigger>
            <TabsTrigger value="custom">自定义</TabsTrigger>
          </TabsList>

          {/* 预设颜色 */}
          <TabsContent value="preset" className="space-y-3 p-3">
            <div className="grid grid-cols-6 gap-2">
              {TEXT_COLORS.map((item) => (
                <Tooltip key={item.value || "default"}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        setColor(item.value);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded border-2 transition-all hover:scale-110",
                        currentColor === item.value ? "border-primary ring-primary/20 ring-2" : "border-border"
                      )}
                      style={{
                        backgroundColor: item.displayColor === "currentColor" ? "transparent" : item.displayColor
                      }}
                    >
                      {item.displayColor === "currentColor" && <span className="text-xs font-bold">A</span>}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{item.name}</TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* 快速清除按钮 */}
            {currentColor && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setColor("");
                  setIsOpen(false);
                }}
                className="w-full"
              >
                <X className="mr-2 h-4 w-4" />
                清除颜色
              </Button>
            )}
          </TabsContent>

          {/* 自定义颜色 */}
          <TabsContent value="custom" className="space-y-3 p-3">
            <div className="space-y-2">
              <Label>选择颜色</Label>
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
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={applyCustomColor} className="flex-1">
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
