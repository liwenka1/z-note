import { X } from "lucide-react";
import { Button } from "@renderer/components/ui/button";

/**
 * 返回按钮组件（展示组件）
 * 职责：纯 UI 渲染
 */
interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick} className="h-7 w-7 p-0">
      <X className="h-4 w-4" />
    </Button>
  );
}
