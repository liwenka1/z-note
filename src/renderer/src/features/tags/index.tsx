/**
 * Tags模块主入口组件
 * 管理Tag和Mark的增删改查功能
 */
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@renderer/components/ui/empty";
import { AlertCircle } from "lucide-react";
import { TagList } from "./tag-list";
import { useTags } from "@renderer/hooks/queries";

export function TagsPanel() {
  const { data: tags, isLoading, error } = useTags();

  // 添加错误处理和调试信息
  if (error) {
    console.error("Tags loading error:", error);
    return (
      <Empty className="h-full border-0">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircle className="text-destructive size-6" />
          </EmptyMedia>
          <EmptyTitle className="text-destructive">加载失败</EmptyTitle>
          <EmptyDescription>{error instanceof Error ? error.message : "未知错误"}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground text-sm">加载中...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        <TagList tags={tags || []} />
      </div>
    </div>
  );
}
