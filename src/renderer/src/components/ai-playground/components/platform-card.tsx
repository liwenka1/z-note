import { useState } from "react";
import { Globe, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from "@renderer/components/ui/item";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@renderer/components/ui/dropdown-menu";
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
import { useAIPlatformsStore } from "@renderer/stores";
import type { AIPlatform } from "../constants/ai-platforms";
import { EditPlatformDialog } from "./edit-platform-dialog";

interface PlatformCardProps {
  platform: AIPlatform;
  onSelect: (platform: AIPlatform) => void;
  isCustom?: boolean;
}

export function PlatformCard({ platform, onSelect, isCustom = false }: PlatformCardProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const removePlatform = useAIPlatformsStore((state) => state.removePlatform);

  const handleDelete = () => {
    removePlatform(platform.id);
    setShowDeleteAlert(false);
  };

  return (
    <>
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
        {isCustom && (
          <ItemActions>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEditDialog(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteAlert(true);
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ItemActions>
        )}
      </Item>

      {/* 编辑对话框 */}
      <EditPlatformDialog platform={platform} open={showEditDialog} onOpenChange={setShowEditDialog} />

      {/* 删除确认对话框 */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
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
    </>
  );
}
