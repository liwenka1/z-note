/**
 * Mark列表组件
 * 显示指定Tag下的所有Marks
 */
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { MarkItem } from "./mark-item";
import { MarkToolbar } from "./toolbar";
import { useMarksByTag } from "@renderer/hooks/queries";

interface MarkListProps {
  tagId: number;
}

export function MarkList({ tagId }: MarkListProps) {
  const { data: marks, isLoading } = useMarksByTag(tagId);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground text-sm">加载中...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <MarkToolbar tagId={tagId} />

      {/* Marks List */}
      <ScrollArea className="flex-1">
        {!marks || marks.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="text-muted-foreground text-sm">还没有任何记录</div>
              <div className="text-muted-foreground mt-1 text-xs">点击工具栏中的按钮创建记录</div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {marks.map((mark) => (
              <MarkItem key={mark.id} mark={mark} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
