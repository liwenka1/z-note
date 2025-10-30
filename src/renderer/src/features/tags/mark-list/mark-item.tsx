/**
 * 单个Mark项组件
 * 显示Mark信息和操作按钮
 */
import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@renderer/components/ui/dropdown-menu";
import { MARK_TYPE_CONFIG } from "./constants";
import { MarkEditDialog } from "./mark-edit-dialog";
import { MarkDeleteDialog } from "./dialogs/delete-dialog";
import type { Mark } from "@shared/types";

interface MarkItemProps {
  mark: Mark;
}

export function MarkItem({ mark }: MarkItemProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const config = MARK_TYPE_CONFIG[mark.type];
  const Icon = config.icon;

  return (
    <>
      <div className="hover:bg-secondary/60 group border-border/40 rounded-md border p-3 transition-colors">
        <div className="flex items-start gap-3">
          {/* Type Icon */}
          <div className={`shrink-0 ${config.color}`}>
            <Icon className="h-4 w-4" />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            {/* Preview/Description */}
            <div className="text-sm">{mark.desc || mark.content || "无内容"}</div>

            {/* Image Thumbnail (if image type) */}
            {mark.type === "image" && mark.url && (
              <div className="mt-2">
                <img
                  src={`z-note-image://${mark.url}`}
                  alt="缩略图"
                  className="border-border/50 h-16 w-16 rounded border object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* URL (if exists) */}
            {mark.url && mark.type === "link" && (
              <div className="text-muted-foreground mt-1 truncate text-xs">🔗 {mark.url}</div>
            )}

            {/* Created Time */}
            <div className="text-muted-foreground mt-2 text-xs">
              {mark.createdAt ? new Date(mark.createdAt).toLocaleDateString("zh-CN") : "未知时间"}
            </div>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom">
              <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                <Edit className="mr-2 h-3 w-3" />
                编辑
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-3 w-3" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Dialogs */}
      <MarkEditDialog mark={mark} open={showEditDialog} onClose={() => setShowEditDialog(false)} />
      <MarkDeleteDialog mark={mark} open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
    </>
  );
}
