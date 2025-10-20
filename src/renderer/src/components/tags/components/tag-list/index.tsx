/**
 * Tag列表组件
 * 显示所有Tags和操作按钮
 */
import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { TagItem } from "./components/tag-item";
import { TagCreateForm } from "./components/tag-create-form";
import { useTabStore } from "@renderer/stores";
import { useNavigate } from "@tanstack/react-router";
import type { Tag } from "@shared/types";

interface TagListProps {
  tags: Tag[];
}

export function TagList({ tags }: TagListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { openTagTab } = useTabStore();
  const navigate = useNavigate();

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  const handleTagClick = (tag: Tag) => {
    // 打开新的tag标签页
    openTagTab(tag.id, tag.name);
    // 导航到tag详情页面
    navigate({ to: "/tags/$tagId", params: { tagId: tag.id.toString() } });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-border/50 bg-secondary/30 flex h-12 shrink-0 items-center justify-between border-b px-4">
        <h2 className="text-sm font-medium">标签</h2>
        <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(true)} className="h-7 w-7 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="border-border/50 bg-secondary/30 shrink-0 border-b px-4 py-3">
          <TagCreateForm onSuccess={handleCreateSuccess} onCancel={() => setShowCreateForm(false)} />
        </div>
      )}

      {/* Tags List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {tags.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="text-muted-foreground text-sm">还没有任何标签</div>
                <div className="text-muted-foreground mt-1 text-xs">点击右上角 + 号创建第一个标签</div>
              </div>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {tags.map((tag) => (
                <TagItem key={tag.id} tag={tag} onClick={() => handleTagClick(tag)} />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
