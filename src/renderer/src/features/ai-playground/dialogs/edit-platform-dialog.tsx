import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@renderer/components/ui/dialog";
import { PlatformForm, type PlatformFormData } from "./platform-form";
import { usePlatformActions } from "../hooks/use-platform-actions";
import type { AIPlatform } from "../constants/ai-platforms";

/**
 * 编辑平台对话框（简化版）
 * 职责：对话框状态管理 + 调用 Hook 执行更新
 */
interface EditPlatformDialogProps {
  platform: AIPlatform;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPlatformDialog({ platform, open, onOpenChange }: EditPlatformDialogProps) {
  const { handleUpdatePlatform } = usePlatformActions();
  const [key, setKey] = useState(0);

  // 当对话框打开或平台改变时，重置表单（通过改变 key）
  useEffect(() => {
    if (open) {
      setKey((prev) => prev + 1);
    }
  }, [open, platform]);

  const handleSubmit = (data: PlatformFormData) => {
    handleUpdatePlatform(platform.id, data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑 AI 平台</DialogTitle>
          <DialogDescription>修改平台的信息</DialogDescription>
        </DialogHeader>
        <PlatformForm
          key={key}
          initialData={{
            name: platform.name,
            url: platform.url,
            description: platform.description
          }}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel="保存"
        />
      </DialogContent>
    </Dialog>
  );
}
