/**
 * Tags模块主入口组件
 * 管理Tag和Mark的增删改查功能
 */
import { useState } from "react";
import { TagList } from "./components/tag-list";
import { MarkList } from "./components/mark-list";
import { useTags } from "@renderer/hooks/queries";

export function TagsPanel() {
  const { data: tags, isLoading, error } = useTags();
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  // 返回Tag列表还是Mark列表
  const handleBackToTags = () => {
    setSelectedTagId(null);
  };

  const handleSelectTag = (tagId: number) => {
    setSelectedTagId(tagId);
  };

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
    <div className="h-full">
      {selectedTagId ? (
        <MarkList tagId={selectedTagId} onBack={handleBackToTags} />
      ) : (
        <TagList tags={tags || []} onSelectTag={handleSelectTag} />
      )}
    </div>
  );
}
