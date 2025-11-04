/**
 * Mark列表组件
 * 显示指定Tag下的所有Marks
 */
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@renderer/components/ui/empty";
import { FileText } from "lucide-react";
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
      <div className="flex-1 overflow-auto">
        {!marks || marks.length === 0 ? (
          <Empty className="h-full border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText className="size-6" />
              </EmptyMedia>
              <EmptyTitle>还没有任何记录</EmptyTitle>
              <EmptyDescription>点击工具栏中的按钮创建记录</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-2 p-2">
            {marks.map((mark) => (
              <MarkItem key={mark.id} mark={mark} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
