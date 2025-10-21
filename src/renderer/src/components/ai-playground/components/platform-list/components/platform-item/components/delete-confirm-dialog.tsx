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
import { usePlatformActions } from "@renderer/components/ai-playground/hooks/use-platform-actions";
import type { AIPlatform } from "@renderer/components/ai-playground/constants/ai-platforms";

/**
 * 删除确认对话框（展示组件）
 * 职责：渲染删除确认 UI，调用 Hook 执行删除
 */
interface DeleteConfirmDialogProps {
  platform: AIPlatform;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteConfirmDialog({ platform, open, onOpenChange }: DeleteConfirmDialogProps) {
  const { handleDeletePlatform } = usePlatformActions();

  const handleDelete = () => {
    handleDeletePlatform(platform.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>确定要删除平台 {platform.name} 吗？此操作无法撤销。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
