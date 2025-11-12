import { useState, useRef, useEffect } from "react";
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

  const getDisplayName = (fileName: string) => {
    return fileName.endsWith(".json") ? fileName.slice(0, -5) : fileName;
  };

  const [newName, setNewName] = useState(getDisplayName(file.name));
  const inputRef = useRef<HTMLInputElement>(null);

  const { selectedPath, selectNode, openFile, renameFile, deleteFile } = useFilesState();

  const displayName = getDisplayName(file.name);
  const isSelected = selectedPath === file.path;

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleFileClick = async () => {
    selectNode(file.path, false);

    if (file.name.endsWith(".json")) {
      try {
        await openFile(file.path);

        const fileNoteId = createFileNoteId(file.path);
        const noteContent = await filesApi.readNoteFile(file.path);

        openTab(fileNoteId, noteContent.metadata.title, "note");
        navigate({ to: "/notes/$noteId", params: { noteId: fileNoteId } });
      } catch (error) {
        console.error("Failed to open note file:", error);
        toast.error("无法打开笔记文件");
      }
    }
  };

  const handleRename = async () => {
    if (newName.trim() && newName.trim() !== getDisplayName(file.name)) {
      let actualNewName = newName.trim();
      if (file.name.endsWith(".json") && !actualNewName.endsWith(".json")) {
        actualNewName += ".json";
      }

      const newPath = file.path.replace(file.name, actualNewName);
      try {
        await renameFile(file.path, newPath);
      } catch (error) {
        console.error("Failed to rename file:", error);
        setNewName(getDisplayName(file.name));
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
      await shellApi.showItemInFolder(file.path);
    } catch (error) {
      console.error("查看文件位置失败:", error);
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

  const getFileIcon = () => <File className="text-muted-foreground h-4 w-4" />;

  return (
    <div
      className="hover:bg-muted/50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground group flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors duration-200"
      data-selected={isSelected}
      style={{ paddingLeft: `${level * 20 + 20}px` }}
      onClick={handleFileClick}
    >
      <div className="ml-1 shrink-0">{getFileIcon()}</div>

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
          <span className="block truncate" title={displayName}>
            {displayName}
          </span>
        )}
      </div>

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
              setNewName(file.name);
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
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 hover:bg-transparent"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3" />
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
