import { useState } from "react";
import { useFilesState } from "../hooks/use-files-state";
import { FolderHeader } from "./folder-header";
import { RenameInput } from "./rename-input";
import { FolderActions } from "./folder-actions";
import { FolderChildren } from "./folder-children";
import { cn } from "@renderer/lib/utils";
import type { FileNode } from "@shared/types";

interface FolderItemProps {
  folder: FileNode;
  level: number;
}

/**
 * 文件夹项组件
 * 主容器，组合各个子组件
 */
export function FolderItem({ folder, level }: FolderItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);

  const { selectedPath, expandedFolders, selectNode, toggleFolder, renameFile, deleteFile, createFile, createFolder } =
    useFilesState();

  const isSelected = selectedPath === folder.path;
  const isExpanded = expandedFolders.has(folder.path);

  const handleSelect = () => {
    selectNode(folder.path, true);
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFolder(folder.path);
  };

  const handleRename = async (newName: string) => {
    const newPath = folder.path.replace(folder.name, newName);
    await renameFile(folder.path, newPath);
    setIsRenaming(false);
  };

  const handleCancelRename = () => {
    setIsRenaming(false);
  };

  const handleDelete = async () => {
    await deleteFile(folder.path);
  };

  const handleCreateSubfolder = async () => {
    const folderName = `新文件夹_${Date.now()}`;
    await createFolder(folder.path, folderName);
  };

  const handleCreateFile = async () => {
    const fileName = `新笔记_${Date.now()}.json`;
    await createFile(folder.path, fileName);
  };

  const handleStartRename = () => {
    setIsRenaming(true);
  };

  return (
    <div className="select-none">
      {isRenaming ? (
        <RenameInput initialName={folder.name} level={level} onRename={handleRename} onCancel={handleCancelRename} />
      ) : (
        <div
          className={cn(
            "group flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors duration-200",
            "hover:bg-muted/50",
            isSelected && "bg-accent text-accent-foreground"
          )}
          onClick={handleSelect}
        >
          <FolderHeader name={folder.name} isExpanded={isExpanded} level={level} onToggleExpand={handleToggleExpand} />

          <FolderActions
            folderPath={folder.path}
            onRename={handleStartRename}
            onDelete={handleDelete}
            onCreateSubfolder={handleCreateSubfolder}
            onCreateFile={handleCreateFile}
          />
        </div>
      )}

      {folder.children && (
        <FolderChildren
          childNodes={folder.children}
          level={level}
          isExpanded={isExpanded}
          renderFolder={(childFolder, childLevel) => <FolderItem folder={childFolder} level={childLevel} />}
        />
      )}
    </div>
  );
}
