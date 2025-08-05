import { Button } from "@renderer/components/ui/button";
import { useNotesStore } from "@renderer/store";
import { useNavigate, Link } from "@tanstack/react-router";
import type { Folder } from "@renderer/types";
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
  FileText,
  NotebookPen
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface FolderTreeItemProps {
  folder: Folder;
  level: number;
  isSelected: boolean;
  onSelect: (folderId: string) => void;
  onToggleExpand: (folderId: string) => void;
  onCreateSubfolder: (parentId: string) => void;
  onCreateNote: (folderId: string) => void;
  folderNotes: Array<{ id: string; title: string; folderId?: string }>;
}

function FolderTreeItem({
  folder,
  level,
  isSelected,
  onSelect,
  onToggleExpand,
  onCreateSubfolder,
  onCreateNote,
  folderNotes
}: FolderTreeItemProps) {
  const { folders, notes, updateFolder, deleteFolder } = useNotesStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(folder.name);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 获取子文件夹
  const activeFolders = folders.filter((f) => !f.isDeleted);
  const children = activeFolders.filter((f) => f.parentId === folder.id);
  const hasChildren = children.length > 0;

  // 计算文件夹内的笔记数量（只计算直接属于该文件夹的笔记）
  const notesInFolder = notes.filter((note) => !note.isDeleted && note.folderId === folder.id);
  const notesCount = notesInFolder.length;

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
    return undefined;
  }, [showMenu]);

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(folder.id);
  };

  const handleSelect = () => {
    onSelect(folder.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
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
    setShowMenu(false);
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
        className={`group hover:bg-sidebar-accent flex cursor-pointer items-center rounded py-2 text-sm transition-colors ${
          isSelected ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
        }`}
        style={{ paddingLeft: `${level * 12}px` }}
        onClick={handleSelect}
      >
        {/* 展开/收起按钮 */}
        <Button
          variant="ghost"
          size="sm"
          className="text-sidebar-foreground mr-2 h-4 w-4 p-0"
          onClick={handleToggleExpand}
        >
          {folder.isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </Button>

        {/* 文件夹图标 */}
        <div className="mr-3">
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
            className="bg-background border-border mr-2 flex-1 rounded border px-1 py-0.5 text-sm"
            autoFocus
          />
        ) : (
          <span className="flex-1 truncate">{folder.name}</span>
        )}

        {/* 文件夹笔记数量 */}
        <span className="text-muted-foreground mr-2 text-xs">{notesCount}</span>

        {/* 更多操作按钮 */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="text-sidebar-foreground hover:bg-sidebar-accent h-4 w-4 p-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>

          {/* 下拉菜单 */}
          {showMenu && (
            <div
              ref={menuRef}
              className="bg-sidebar border-sidebar-border absolute top-5 right-0 z-50 min-w-32 rounded-md border p-1 shadow-lg"
            >
              <button
                className="text-sidebar-foreground hover:bg-sidebar-accent flex w-full items-center px-3 py-1.5 text-sm transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateNote(folder.id);
                  setShowMenu(false);
                }}
              >
                <FileText className="mr-2 h-3 w-3" />
                新建笔记
              </button>
              <button
                className="text-sidebar-foreground hover:bg-sidebar-accent flex w-full items-center px-3 py-1.5 text-sm transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateSubfolder(folder.id);
                  setShowMenu(false);
                }}
              >
                <Plus className="mr-2 h-3 w-3" />
                新建文件夹
              </button>
              <div className="border-sidebar-border my-1 border-t"></div>
              <button
                className="text-sidebar-foreground hover:bg-sidebar-accent flex w-full items-center px-3 py-1.5 text-sm transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
              >
                <Edit2 className="mr-2 h-3 w-3" />
                重命名
              </button>
              <button
                className="text-sidebar-foreground hover:bg-sidebar-accent flex w-full items-center px-3 py-1.5 text-sm transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <Trash2 className="mr-2 h-3 w-3" />
                删除
              </button>
            </div>
          )}
        </div>

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
                <FolderTreeItem
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

// 笔记项组件
interface NoteItemProps {
  note: { id: string; title: string; folderId?: string };
  level: number;
}

function NoteItem({ note, level }: NoteItemProps) {
  const { updateNote, deleteNote } = useNotesStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
    return undefined;
  }, [showMenu]);

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== note.title) {
      updateNote(note.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
    setEditTitle(note.title);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(note.title);
  };

  const handleDelete = () => {
    deleteNote(note.id);
    setShowMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div
      className="group hover:bg-sidebar-accent flex cursor-pointer items-center rounded py-2 text-sm transition-colors"
      style={{ paddingLeft: `${(level + 1) * 12}px` }}
    >
      <div className="mr-3">
        <NotebookPen className="h-4 w-4 text-blue-500" />
      </div>

      {/* 笔记标题 */}
      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="bg-background border-border mr-2 flex-1 rounded border px-1 py-0.5 text-sm"
          autoFocus
        />
      ) : (
        <Link
          to="/notes/$noteId"
          params={{ noteId: note.id }}
          className="text-sidebar-foreground flex-1 truncate hover:bg-transparent"
        >
          {note.title}
        </Link>
      )}

      {/* 更多操作按钮 */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="text-sidebar-foreground hover:bg-sidebar-accent h-4 w-4 p-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          <MoreHorizontal className="h-3 w-3" />
        </Button>

        {/* 下拉菜单 */}
        {showMenu && (
          <div
            ref={menuRef}
            className="bg-sidebar border-sidebar-border absolute top-5 right-0 z-50 min-w-32 rounded-md border p-1 shadow-lg"
          >
            <button
              className="text-sidebar-foreground hover:bg-sidebar-accent flex w-full items-center px-3 py-1.5 text-sm transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
            >
              <Edit2 className="mr-2 h-3 w-3" />
              重命名
            </button>
            <button
              className="text-sidebar-foreground hover:bg-sidebar-accent flex w-full items-center px-3 py-1.5 text-sm transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <Trash2 className="mr-2 h-3 w-3" />
              删除
            </button>
          </div>
        )}
      </div>

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
  );
}

export function FolderTree() {
  const { folders, notes, selectedFolderId, setSelectedFolder, toggleFolderExpanded, createFolder, createNote } =
    useNotesStore();
  const navigate = useNavigate();

  // 直接在组件中计算，确保响应性
  const activeFolders = folders.filter((folder) => !folder.isDeleted);
  const activeNotes = notes.filter((note) => !note.isDeleted);

  // 构建文件夹树 - 直接在组件中计算
  const buildFolderTree = (folders: Folder[]): Folder[] => {
    return folders.filter((folder) => !folder.parentId);
  };

  const folderTree = buildFolderTree(activeFolders);
  const rootFolders = folderTree;

  // 获取根级别的笔记（没有文件夹的笔记）
  const rootNotes = activeNotes.filter((note) => !note.folderId);

  const handleCreateSubfolder = (parentId: string) => {
    const newFolderName = `新文件夹 ${Date.now()}`;
    createFolder({
      name: newFolderName,
      parentId,
      description: "",
      color: "#6b7280", // 默认灰色
      icon: "📁",
      isDeleted: false,
      sortOrder: 0
    });
  };

  const handleCreateRootFolder = () => {
    const newFolderName = `新文件夹 ${Date.now()}`;
    createFolder({
      name: newFolderName,
      parentId: undefined,
      description: "",
      color: "#6b7280", // 默认灰色
      icon: "📁",
      isDeleted: false,
      sortOrder: 0
    });
  };

  const handleCreateNoteInFolder = (folderId: string) => {
    const newNoteId = createNote({
      title: `新笔记 ${Date.now()}`,
      content: "",
      folderId,
      tags: [],
      isFavorite: false,
      isDeleted: false
    });
    console.log("在文件夹中创建笔记:", newNoteId, "文件夹ID:", folderId);
    // 导航到新创建的笔记
    navigate({ to: "/notes/$noteId", params: { noteId: newNoteId } });
  };

  return (
    <div className="space-y-1">
      {/* 文件夹和笔记混合显示 */}
      {rootFolders
        .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
        .map((folder) => (
          <FolderTreeItem
            key={folder.id}
            folder={folder}
            level={0}
            isSelected={selectedFolderId === folder.id}
            onSelect={setSelectedFolder}
            onToggleExpand={toggleFolderExpanded}
            onCreateSubfolder={handleCreateSubfolder}
            onCreateNote={handleCreateNoteInFolder}
            folderNotes={activeNotes}
          />
        ))}

      {/* 根级别的笔记 */}
      {rootNotes
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((note) => (
          <NoteItem key={note.id} note={note} level={0} />
        ))}

      {/* 创建新文件夹按钮 - 只在没有文件夹和笔记时显示 */}
      {rootFolders.length === 0 && rootNotes.length === 0 && (
        <div className="pt-2">
          <Button
            variant="ghost"
            className="text-sidebar-foreground hover:bg-sidebar-accent w-full justify-start py-2 text-sm transition-colors duration-200"
            onClick={handleCreateRootFolder}
          >
            <Plus className="mr-3 h-4 w-4" />
            新建文件夹
          </Button>
        </div>
      )}
    </div>
  );
}
