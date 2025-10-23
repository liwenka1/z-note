import { useState } from "react";
import { Globe } from "lucide-react";
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from "@renderer/components/ui/item";
import { PlatformActions } from "./platform-actions";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { EditPlatformDialog } from "../../dialogs/edit-platform-dialog";
import type { AIPlatform } from "../../constants/ai-platforms";

/**
 * 平台项组件（容器组件）
 * 职责：卡片渲染 + Dialog 状态管理
 */
interface PlatformItemProps {
  platform: AIPlatform;
  isCustom: boolean;
  onSelect: (platform: AIPlatform) => void;
}

export function PlatformItem({ platform, isCustom, onSelect }: PlatformItemProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      {/* 卡片主体 */}
      <Item
        variant="outline"
        size="sm"
        className="hover:bg-accent/50 cursor-pointer"
        onClick={() => onSelect(platform)}
      >
        <ItemMedia variant="icon">
          <Globe className="size-4" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{platform.name}</ItemTitle>
          {platform.description && <ItemDescription>{platform.description}</ItemDescription>}
        </ItemContent>

        {/* 自定义平台的操作按钮 */}
        {isCustom && (
          <ItemActions>
            <PlatformActions onEdit={() => setShowEditDialog(true)} onDelete={() => setShowDeleteDialog(true)} />
          </ItemActions>
        )}
      </Item>

      {/* 编辑对话框 */}
      <EditPlatformDialog platform={platform} open={showEditDialog} onOpenChange={setShowEditDialog} />

      {/* 删除确认对话框 */}
      <DeleteConfirmDialog platform={platform} open={showDeleteDialog} onOpenChange={setShowDeleteDialog} />
    </>
  );
}
