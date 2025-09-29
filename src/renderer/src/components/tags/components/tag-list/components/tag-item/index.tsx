import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { MoreVertical, Edit, Trash, Tag as TagIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@renderer/components/ui/dropdown-menu";
import type { Tag } from "@renderer/types";
import { useMarksByTag } from "@renderer/hooks/queries";
import { TagEditForm } from "./components/tag-edit-form";
import { TagDeleteDialog } from "./components/tag-delete-dialog";

interface TagItemProps {
  tag: Tag;
  onClick: () => void;
}

export function TagItem({ tag, onClick }: TagItemProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // 获取该标签下的Mark数量
  const { data: marks } = useMarksByTag(tag.id);
  const markCount = marks?.length || 0;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditForm(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
  };

  const handleEditCancel = () => {
    setShowEditForm(false);
  };

  const handleDeleteClose = () => {
    setShowDeleteDialog(false);
  };

  if (showEditForm) {
    return <TagEditForm tag={tag} onSuccess={handleEditSuccess} onCancel={handleEditCancel} />;
  }

  return (
    <>
      <div
        className="group hover:bg-secondary/50 flex cursor-pointer items-center justify-between rounded-lg p-2"
        onClick={onClick}
      >
        <div className="flex flex-1 items-center gap-2">
          <TagIcon className="h-4 w-4 text-blue-500" />
          <div className="flex-1">
            <div className="text-sm font-medium">{tag.name}</div>
            {markCount > 0 && <div className="text-muted-foreground text-xs">{markCount} 条记录</div>}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-3 w-3" />
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash className="mr-2 h-3 w-3" />
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <TagDeleteDialog tag={tag} open={showDeleteDialog} onClose={handleDeleteClose} />
    </>
  );
}
