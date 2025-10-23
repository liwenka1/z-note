import React, { useState, useRef, useEffect } from "react";
import { File, MoreVertical, Edit, Trash2, X, Check, FolderOpen } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@renderer/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@renderer/components/ui/dropdown-menu";
import { Input } from "@renderer/components/ui/input";
import { useFilesState } from "./hooks/use-files-state";
import { useTabStore } from "@renderer/stores";
import { shellApi, filesApi } from "@renderer/api";
import { createFileNoteId } from "@renderer/utils/file-content";
import { cn } from "@renderer/lib/utils";
import type { FileNode } from "@shared/types";

interface NoteItemProps {
  file: FileNode;
  level: number;
}

export function NoteItem({ file, level }: NoteItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const navigate = useNavigate();
  const { openTab } = useTabStore();

  // 获取显示用的文件名（去掉.json后缀）
  const getDisplayName = (fileName: string) => {
    // 如果是.json文件，去掉后缀
    if (fileName.endsWith(".json")) {
      return fileName.slice(0, -5);
    }
    return fileName;
  };

  const [newName, setNewName] = useState(getDisplayName(file.name));
  const inputRef = useRef<HTMLInputElement>(null);

  const { selectedFile, selectFile, renameFile, deleteFile } = useFilesState();

  const displayName = getDisplayName(file.name);
  const isSelected = selectedFile === file.path;

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleFileClick = async () => {
    try {
      // 首先选中文件（保持现有行为）
      await selectFile(file.path);

      // 如果是 .json 文件，尝试作为笔记打开
      if (file.name.endsWith(".json")) {
        try {
          // 读取笔记文件内容
          const noteContent = await filesApi.readNoteFile(file.path);

          // 生成文件 noteId
          const fileNoteId = createFileNoteId(file.path);

          // 打开标签页
          openTab(fileNoteId, noteContent.metadata.title, "note");

          // 导航到笔记页面
          navigate({ to: "/notes/$noteId", params: { noteId: fileNoteId } });
        } catch (error) {
          console.error("Failed to open note file:", error);
          toast.error("无法打开笔记文件");
        }
      }
    } catch (error) {
      console.error("Failed to select file:", error);
    }
  };

  const handleRename = async () => {
    if (newName.trim() && newName.trim() !== getDisplayName(file.name)) {
      // 如果原文件是.json，确保新名称也添加.json后缀
      let actualNewName = newName.trim();
      if (file.name.endsWith(".json") && !actualNewName.endsWith(".json")) {
        actualNewName += ".json";
      }

      const newPath = file.path.replace(file.name, actualNewName);
      try {
        await renameFile(file.path, newPath);
      } catch (error) {
        console.error("Failed to rename file:", error);
        setNewName(getDisplayName(file.name)); // Reset on error
      }
    }
    setIsRenaming(false);
  };

  const handleDelete = async () => {
    try {
      await deleteFile(file.path);
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  const handleShowInFolder = async () => {
    try {
      // 使用shellApi在文件管理器中显示文件
      await shellApi.showItemInFolder(file.path);
    } catch (error) {
      console.error("查看文件位置失败:", error);
      // 备用方案：打开文件所在目录
      try {
        const dirPath = file.path.substring(0, file.path.lastIndexOf("\\"));
        await shellApi.openPath(dirPath);
      } catch (fallbackError) {
        console.error("打开文件夹失败:", fallbackError);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setNewName(getDisplayName(file.name));
      setIsRenaming(false);
    }
  };

  const getFileIcon = () => {
    // 所有文件都使用统一的灰色图标，不区分类型
    return <File className={cn("text-muted-foreground h-4 w-4")} />;
  };

  return (
    <div
      className={cn(
        "group flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors duration-200",
        "hover:bg-muted/50",
        isSelected && "bg-accent text-accent-foreground"
      )}
      style={{ paddingLeft: `${level * 20 + 20}px` }} // +20px 是为了与文件夹的展开按钮对齐 (px-2已提供8px)
      onClick={handleFileClick}
    >
      {/* 文件图标 */}
      <div className={cn("ml-1 shrink-0")}>{getFileIcon()}</div>

      {/* 文件名 / 重命名输入框 */}
      <div className={cn("min-w-0 flex-1")}>
        {isRenaming ? (
          <Input
            ref={inputRef}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleRename}
            className={cn("h-6 px-1 text-sm")}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className={cn("block truncate")} title={displayName}>
            {displayName}
          </span>
        )}
      </div>

      {/* 操作按钮 */}
      {isRenaming ? (
        <div className={cn("flex shrink-0 items-center gap-1")}>
          <Button
            size="sm"
            variant="ghost"
            className={cn("h-6 w-6 p-0")}
            onClick={(e) => {
              e.stopPropagation();
              handleRename();
            }}
          >
            <Check className={cn("h-3 w-3")} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className={cn("h-6 w-6 p-0")}
            onClick={(e) => {
              e.stopPropagation();
              setNewName(file.name);
              setIsRenaming(false);
            }}
          >
            <X className={cn("h-3 w-3")} />
          </Button>
        </div>
      ) : (
        <div className={cn("shrink-0 opacity-0 transition-opacity group-hover:opacity-100")}>
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className={cn("h-6 w-6 p-0 hover:bg-transparent")}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className={cn("h-3 w-3")} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowInFolder();
                  setIsMenuOpen(false);
                }}
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                查看目录
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRenaming(true);
                  setIsMenuOpen(false);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                重命名
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                  setIsMenuOpen(false);
                }}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
