import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@renderer/components/ui/alert-dialog";
import { useDeleteTag } from "@renderer/hooks/mutations";
import { useMarksByTag } from "@renderer/hooks/queries";
import type { Tag } from "@shared/types";

interface TagDeleteDialogProps {
  tag: Tag;
  open: boolean;
  onClose: () => void;
}

export function TagDeleteDialog({ tag, open, onClose }: TagDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteTag = useDeleteTag();
  const { data: marks } = useMarksByTag(tag.id);
  const markCount = marks?.length || 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTag.mutateAsync(tag.id);
      onClose();
    } catch (error) {
      console.error("删除标签失败:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>删除标签</AlertDialogTitle>
          <AlertDialogDescription>
            你确定要删除标签 <strong>&ldquo;{tag.name}&rdquo;</strong> 吗？
            {markCount > 0 && (
              <>
                <br />
                <br />
                ⚠️ 该标签下有 <strong>{markCount}</strong> 条记录，删除后这些记录也将被删除且无法恢复。
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
            {isDeleting ? "删除中..." : "删除"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
