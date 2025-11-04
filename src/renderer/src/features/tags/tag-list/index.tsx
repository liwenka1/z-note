/**
 * Tag列表组件
 * 显示所有Tags和操作按钮
 */
import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@renderer/components/ui/empty";
import { Plus, Tags } from "lucide-react";
import { TagItem } from "./tag-item";
import { TagCreateForm } from "./tag-create-form";
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
      <div className="border-border/30 bg-secondary/30 flex h-12 shrink-0 items-center justify-between border-b px-4">
        <h2 className="text-sm font-medium">标签</h2>
        <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(true)} className="h-7 w-7 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="border-border/30 bg-secondary/30 shrink-0 border-b px-4 py-3">
          <TagCreateForm onSuccess={handleCreateSuccess} onCancel={() => setShowCreateForm(false)} />
        </div>
      )}

      {/* Tags List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {tags.length === 0 ? (
            <Empty className="h-full border-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Tags className="size-6" />
                </EmptyMedia>
                <EmptyTitle>还没有任何标签</EmptyTitle>
                <EmptyDescription>点击右上角 + 号创建第一个标签</EmptyDescription>
              </EmptyHeader>
            </Empty>
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
