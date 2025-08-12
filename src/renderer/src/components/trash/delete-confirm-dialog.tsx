import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@renderer/components/ui/alert-dialog";
import { Button } from "@renderer/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  itemName: string;
  itemType: "文件夹" | "笔记";
  onConfirm: () => void;
}

export function DeleteConfirmDialog({ itemName, itemType, onConfirm }: DeleteConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:text-destructive h-6 w-6 p-0"
          title="永久删除"
        >
          <Trash2 size={12} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认永久删除</AlertDialogTitle>
          <AlertDialogDescription>
            你确定要永久删除{itemType} &ldquo;{itemName}&rdquo; 吗？
            {itemType === "文件夹"
              ? "此操作无法撤销，文件夹及其中的所有内容将被永久删除。"
              : "此操作无法撤销，笔记内容将被永久删除。"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            永久删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
