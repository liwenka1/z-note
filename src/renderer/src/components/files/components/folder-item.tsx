import React, { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder as FolderIcon,
  FolderOpen,
  MoreVertical,
  Edit,
  Trash2,
  X,
  Check,
  FolderPlus,
  FileText
} from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@renderer/components/ui/dropdown-menu";
import { Input } from "@renderer/components/ui/input";
import { useFilesState } from "../hooks/use-files-state";
import { NoteItem } from "./note-item";
import { shellApi } from "@renderer/api";
import type { FileNode } from "@renderer/types/files";

interface FolderItemProps {
  folder: FileNode;
  level: number;
}

export function FolderItem({ folder, level }: FolderItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(folder.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const { collapsedFolders, toggleFolderCollapse, renameFile, deleteFile, createFile, createFolder } = useFilesState();

  // 修复：使用正确的展开状态逻辑
  const isExpanded = !collapsedFolders.has(folder.path);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleToggleExpand = () => {
    toggleFolderCollapse(folder.path);
  };

  const handleRename = async () => {
    if (newName.trim() && newName.trim() !== folder.name) {
      const newPath = folder.path.replace(folder.name, newName.trim());
      try {
        await renameFile(folder.path, newPath);
      } catch (error) {
        console.error("Failed to rename folder:", error);
        setNewName(folder.name); // Reset on error
      }
    }
    setIsRenaming(false);
  };

  const handleDelete = async () => {
    try {
      await deleteFile(folder.path);
    } catch (error) {
      console.error("Failed to delete folder:", error);
    }
  };

  const handleCreateSubfolder = async () => {
    try {
      const folderName = `新文件夹_${Date.now()}`;
      await createFolder(folder.path, folderName);
    } catch (error) {
      console.error("Failed to create subfolder:", error);
    }
  };

  const handleCreateFile = async () => {
    try {
      const fileName = `新笔记_${Date.now()}.json`;
      await createFile(folder.path, fileName);
    } catch (error) {
      console.error("Failed to create file:", error);
    }
  };

  const handleShowInFolder = async () => {
    try {
      // 使用shellApi在文件管理器中显示文件夹
      await shellApi.showItemInFolder(folder.path);
    } catch (error) {
      console.error("查看文件夹位置失败:", error);
      // 备用方案：直接打开文件夹
      try {
        await shellApi.openPath(folder.path);
      } catch (fallbackError) {
        console.error("打开文件夹失败:", fallbackError);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setNewName(folder.name);
      setIsRenaming(false);
    }
  };

  return (
    <div className="select-none">
      {/* 文件夹主行 */}
      <div
        className="hover:bg-muted/50 group flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {/* 展开/折叠按钮 */}
        <Button variant="ghost" size="sm" className="hover:bg-muted h-5 w-5 p-0" onClick={handleToggleExpand}>
          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </Button>

        {/* 文件夹图标 */}
        <div className="shrink-0">
          {isExpanded ? (
            <FolderOpen className="text-muted-foreground h-4 w-4" />
          ) : (
            <FolderIcon className="text-muted-foreground h-4 w-4" />
          )}
        </div>

        {/* 文件夹名称 / 重命名输入框 */}
        <div className="min-w-0 flex-1">
          {isRenaming ? (
            <Input
              ref={inputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleRename}
              className="h-6 px-1 text-sm"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="block truncate font-medium" title={folder.name}>
              {folder.name}
            </span>
          )}
        </div>

        {/* 操作按钮 */}
        {isRenaming ? (
          <div className="flex shrink-0 items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleRename();
              }}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setNewName(folder.name);
                setIsRenaming(false);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateSubfolder();
                    setIsMenuOpen(false);
                  }}
                >
                  <FolderPlus className="mr-2 h-4 w-4" />
                  新建文件夹
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateFile();
                    setIsMenuOpen(false);
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  新建文件
                </DropdownMenuItem>
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

      {/* 子项（文件夹展开时显示） */}
      {isExpanded && folder.children && (
        <div>
          {folder.children.map((child) => (
            <div key={child.path}>
              {child.isDirectory ? (
                <FolderItem folder={child} level={level + 1} />
              ) : (
                <NoteItem file={child} level={level + 1} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
