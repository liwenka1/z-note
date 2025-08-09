import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder as FolderIcon,
  FolderOpen,
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
  Check,
  X,
  FileText
} from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@renderer/components/ui/dropdown-menu";
import { useNotesStore } from "@renderer/store";
import { cn } from "@renderer/lib/utils";
import type { Folder } from "@renderer/types";
import { NoteItem } from "./note-item";

interface FolderItemProps {
  folder: Folder;
  level: number;
  isSelected: boolean;
  onSelect: (folderId: string) => void;
  onToggleExpand: (folderId: string) => void;
  onCreateSubfolder: (parentId: string) => void;
  onCreateNote: (folderId: string) => void;
  folderNotes: Array<{ id: string; title: string; folderId?: string }>;
}

export function FolderItem({
  folder,
  level,
  isSelected,
  onSelect,
  onToggleExpand,
  onCreateSubfolder,
  onCreateNote,
  folderNotes
}: FolderItemProps) {
  const { folders, notes, updateFolder, deleteFolder } = useNotesStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(folder.name);

  // 获取子文件夹
  const activeFolders = folders.filter((f) => !f.isDeleted);
  const children = activeFolders.filter((f) => f.parentId === folder.id);
  const hasChildren = children.length > 0;

  // 计算文件夹内的笔记数量（只计算直接属于该文件夹的笔记）
  const notesInFolder = notes.filter((note) => !note.isDeleted && note.folderId === folder.id);
  const notesCount = notesInFolder.length;

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(folder.id);
  };

  const handleSelect = () => {
    onSelect(folder.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editName.trim() && editName !== folder.name) {
      updateFolder(folder.id, { name: editName.trim() });
    }
    setIsEditing(false);
    setEditName(folder.name);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditName(folder.name);
  };

  const handleDelete = () => {
    deleteFolder(folder.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div>
      <div
        className={cn(
          "group hover:bg-secondary/60 flex cursor-pointer items-center rounded-md py-1.5 pr-2 text-sm transition-colors",
          isSelected && "bg-secondary/80 text-foreground"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleSelect}
      >
        {/* 展开/收起按钮 */}
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground mr-2 h-4 w-4 p-0"
          onClick={handleToggleExpand}
        >
          {folder.isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </Button>

        {/* 文件夹图标 */}
        <div className="mr-2">
          {folder.isExpanded ? (
            <FolderOpen className="h-4 w-4 text-blue-500" />
          ) : (
            <FolderIcon className="h-4 w-4 text-blue-500" />
          )}
        </div>

        {/* 文件夹名称 */}
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="bg-background border-border focus:ring-ring mr-2 flex-1 rounded border px-2 py-0.5 text-sm focus:ring-1 focus:outline-none"
            autoFocus
          />
        ) : (
          <span className="text-foreground flex-1 truncate">{folder.name}</span>
        )}

        {/* 文件夹笔记数量 */}
        {notesCount > 0 && (
          <span className="text-muted-foreground bg-secondary/50 mr-1 rounded px-1 text-xs">{notesCount}</span>
        )}

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
                onCreateNote(folder.id);
              }}
            >
              <FileText className="mr-2 h-3 w-3" />
              新建笔记
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onCreateSubfolder(folder.id);
              }}
            >
              <Plus className="mr-2 h-3 w-3" />
              新建文件夹
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
            >
              <Edit2 className="mr-2 h-3 w-3" />
              重命名
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <Trash2 className="mr-2 h-3 w-3" />
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 编辑模式的保存/取消按钮 */}
        {isEditing && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 h-4 w-4 p-0 text-green-600 hover:bg-green-50"
              onClick={handleSave}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 h-4 w-4 p-0 text-red-600 hover:bg-red-50"
              onClick={handleCancel}
            >
              <X className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>

      {/* 子文件夹和笔记 */}
      {folder.isExpanded && (
        <div>
          {/* 子文件夹 */}
          {hasChildren &&
            children
              .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
              .map((child) => (
                <FolderItem
                  key={child.id}
                  folder={child}
                  level={level + 1}
                  isSelected={isSelected}
                  onSelect={onSelect}
                  onToggleExpand={onToggleExpand}
                  onCreateSubfolder={onCreateSubfolder}
                  onCreateNote={onCreateNote}
                  folderNotes={folderNotes}
                />
              ))}

          {/* 文件夹内的笔记 */}
          {folderNotes
            .filter((note) => note.folderId === folder.id)
            .map((note) => (
              <NoteItem key={note.id} note={note} level={level + 1} />
            ))}
        </div>
      )}
    </div>
  );
}
