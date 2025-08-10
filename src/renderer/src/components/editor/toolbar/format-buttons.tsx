import { Bold, Italic, Strikethrough, Code, Link, List, ListOrdered, Quote } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";

const formatActions = [
  {
    icon: Bold,
    label: "加粗",
    tooltip: "加粗文本 (Ctrl+B)",
    action: "bold"
  },
  {
    icon: Italic,
    label: "斜体",
    tooltip: "斜体文本 (Ctrl+I)",
    action: "italic"
  },
  {
    icon: Strikethrough,
    label: "删除线",
    tooltip: "删除线文本",
    action: "strikethrough"
  },
  {
    icon: Code,
    label: "代码",
    tooltip: "内联代码",
    action: "code"
  },
  {
    icon: Link,
    label: "链接",
    tooltip: "插入链接",
    action: "link"
  },
  {
    icon: List,
    label: "无序列表",
    tooltip: "无序列表",
    action: "unorderedList"
  },
  {
    icon: ListOrdered,
    label: "有序列表",
    tooltip: "有序列表",
    action: "orderedList"
  },
  {
    icon: Quote,
    label: "引用",
    tooltip: "引用块",
    action: "quote"
  }
];

interface FormatButtonsProps {
  onFormat?: (action: string) => void;
}

export function FormatButtons({ onFormat }: FormatButtonsProps) {
  const handleFormat = (action: string) => {
    // 这里可以实现具体的格式化逻辑
    // 或者通过回调传递给父组件处理
    onFormat?.(action);
    console.log(`Format action: ${action}`);
  };

  return (
    <div className="flex items-center gap-1">
      {formatActions.map(({ icon: Icon, label, tooltip, action }) => (
        <Tooltip key={action}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={() => handleFormat(action)} className="h-8 w-8 p-0">
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
