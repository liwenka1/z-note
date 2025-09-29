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
import { useDeleteMark } from "@renderer/hooks/mutations";
import type { Mark } from "@renderer/types";

interface MarkDeleteDialogProps {
  mark: Mark;
  open: boolean;
  onClose: () => void;
}

export function MarkDeleteDialog({ mark, open, onClose }: MarkDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteMark = useDeleteMark();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMark.mutateAsync(mark.id);
      onClose();
    } catch (error) {
      console.error("删除记录失败:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>删除记录</AlertDialogTitle>
          <AlertDialogDescription>
            你确定要删除记录 <strong>&ldquo;{mark.desc || mark.content || "无内容"}&rdquo;</strong> 吗？
            <br />
            <br />
            此操作无法撤销。
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
