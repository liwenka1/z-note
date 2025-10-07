/**
 * 单个Mark项组件
 * 显示Mark信息和操作按钮
 */
import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { MoreHorizontal, Edit, Trash2, FileText, Image, Link, File, ScanLine } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@renderer/components/ui/dropdown-menu";
import { MarkEditForm } from "./components/mark-edit-form";
import { MarkDeleteDialog } from "./components/mark-delete-dialog";
import type { Mark } from "@renderer/types";

interface MarkItemProps {
  mark: Mark;
}

// Mark类型对应的图标
const typeIcons = {
  text: FileText,
  image: Image,
  link: Link,
  file: File,
  scan: ScanLine
};

// Mark类型对应的颜色
const typeColors = {
  text: "text-blue-500",
  image: "text-green-500",
  link: "text-purple-500",
  file: "text-orange-500",
  scan: "text-pink-500"
};

export function MarkItem({ mark }: MarkItemProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const IconComponent = typeIcons[mark.type];

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditForm(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // 如果是编辑状态，显示编辑表单
  if (showEditForm) {
    return (
      <div className="p-2">
        <MarkEditForm mark={mark} onSuccess={() => setShowEditForm(false)} onCancel={() => setShowEditForm(false)} />
      </div>
    );
  }

  return (
    <>
      <div className="hover:bg-secondary/60 group border-border/40 rounded-md border p-3 transition-colors">
        <div className="flex items-start gap-3">
          {/* Type Icon */}
          <div className={`shrink-0 ${typeColors[mark.type]}`}>
            <IconComponent className="h-4 w-4" />
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
                onClick={handleMenuClick}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-3 w-3" />
                编辑
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-3 w-3" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete Dialog */}
      <MarkDeleteDialog mark={mark} open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
    </>
  );
}
