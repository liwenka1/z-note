/**
 * Tags模块主入口组件
 * 管理Tag和Mark的增删改查功能
 */
import { TagList } from "./tag-list";
import { useTags } from "@renderer/hooks/queries";

export function TagsPanel() {
  const { data: tags, isLoading, error } = useTags();

  // 添加错误处理和调试信息
  if (error) {
    console.error("Tags loading error:", error);
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-red-500">加载失败: {error instanceof Error ? error.message : "未知错误"}</div>
      </div>
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
    <div className="bg-background flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        <TagList tags={tags || []} />
      </div>
    </div>
  );
}
