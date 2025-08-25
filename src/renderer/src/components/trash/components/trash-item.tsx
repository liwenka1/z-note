import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@renderer/components/ui/button";
import { FolderIcon, FileTextIcon, RotateCcw, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@renderer/components/ui/dropdown-menu";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import type { Note, Folder } from "@renderer/types";

interface TrashItemProps {
  item: Note | Folder;
  index: number;
  offset?: number;
  onRestore: () => void;
  onPermanentDelete: () => void;
}

export function TrashItem({ item, index, offset = 0, onRestore, onPermanentDelete }: TrashItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isFolder = "name" in item;
  const displayName = isFolder ? (item as Folder).name : (item as Note).title;
  const itemType = isFolder ? "文件夹" : "笔记";

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: (offset + index) * 0.05 }}
      className="group hover:bg-muted/50 rounded p-3"
    >
      {/* 顶部：类型图标、名称和操作按钮 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {isFolder ? (
            <FolderIcon size={16} className="text-muted-foreground flex-shrink-0" />
          ) : (
            <FileTextIcon size={16} className="text-muted-foreground flex-shrink-0" />
          )}
          <span className="truncate text-sm font-medium">{displayName}</span>
        </div>

        {/* 更多操作按钮 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:bg-secondary hover:text-foreground h-4 w-4 p-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onRestore();
              }}
            >
              <RotateCcw className="mr-2 h-3 w-3" />
              恢复{itemType}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-3 w-3" />
              永久删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 底部：类型和日期信息 */}
      <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
        <span className="flex-shrink-0">{itemType}</span>
        <span>•</span>
        <span>删除于 {item.updatedAt.toLocaleDateString()}</span>
      </div>

      {/* 删除确认对话框 */}
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        itemName={displayName}
        itemType={itemType}
        onConfirm={onPermanentDelete}
      />
    </motion.div>
  );
}
