import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@renderer/components/ui/dialog";
import { PlatformForm, type PlatformFormData } from "./components/platform-form";
import { usePlatformActions } from "@renderer/components/ai-playground/hooks/use-platform-actions";

/**
 * 添加平台对话框（简化版）
 * 职责：对话框状态管理 + 调用 Hook 执行添加
 */
export function AddPlatformDialog() {
  const [open, setOpen] = useState(false);
  const { handleAddPlatform } = usePlatformActions();

  const handleSubmit = (data: PlatformFormData) => {
    handleAddPlatform(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          添加平台
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加自定义 AI 平台</DialogTitle>
          <DialogDescription>添加一个新的 AI 平台到你的工作台</DialogDescription>
        </DialogHeader>
        <PlatformForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} submitLabel="添加" />
      </DialogContent>
    </Dialog>
  );
}
