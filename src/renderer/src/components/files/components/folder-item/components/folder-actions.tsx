import { useState } from "react";
import { MoreVertical, Edit, Trash2, FolderPlus, FileText, FolderOpen } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@renderer/components/ui/dropdown-menu";
import { shellApi } from "@renderer/api";
import { cn } from "@renderer/lib/utils";

interface FolderActionsProps {
  folderPath: string;
  onRename: () => void;
  onDelete: () => Promise<void>;
  onCreateSubfolder: () => Promise<void>;
  onCreateFile: () => Promise<void>;
}

/**
 * 文件夹操作菜单组件
 * 负责处理文件夹的各种操作（重命名、删除、创建等）
 */
export function FolderActions({ folderPath, onRename, onDelete, onCreateSubfolder, onCreateFile }: FolderActionsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleShowInFolder = async () => {
    try {
      // 使用shellApi在文件管理器中显示文件夹
      await shellApi.showItemInFolder(folderPath);
    } catch (error) {
      console.error("查看文件夹位置失败:", error);
      // 备用方案：直接打开文件夹
      try {
        await shellApi.openPath(folderPath);
      } catch (fallbackError) {
        console.error("打开文件夹失败:", fallbackError);
      }
    }
  };

  const handleMenuAction = async (action: () => void | Promise<void>) => {
    try {
      await action();
    } catch (error) {
      console.error("操作失败:", error);
    } finally {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className={cn("shrink-0 opacity-0 transition-opacity group-hover:opacity-100")}>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost" className={cn("h-6 w-6 p-0")} onClick={(e) => e.stopPropagation()}>
            <MoreVertical className={cn("h-3 w-3")} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleMenuAction(onCreateSubfolder);
            }}
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            新建文件夹
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleMenuAction(onCreateFile);
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            新建笔记
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleMenuAction(handleShowInFolder);
            }}
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            查看目录
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onRename();
              setIsMenuOpen(false);
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            重命名
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleMenuAction(onDelete);
            }}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
