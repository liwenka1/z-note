import { useState } from "react";
import { useFilesState } from "../../hooks/use-files-state";
import { FolderHeader } from "./components/folder-header";
import { RenameInput } from "./components/rename-input";
import { FolderActions } from "./components/folder-actions";
import { FolderChildren } from "./components/folder-children";
import type { FileNode } from "@shared/types";

interface FolderItemProps {
  folder: FileNode;
  level: number;
}

/**
 * 文件夹项组件
 * 重构后的主容器，组合各个子组件
 */
export function FolderItem({ folder, level }: FolderItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);

  const { expandedFolders, toggleFolderCollapse, renameFile, deleteFile, createFile, createFolder } = useFilesState();

  // 使用正确的展开状态逻辑
  const isExpanded = expandedFolders.has(folder.path);

  const handleToggleExpand = () => {
    toggleFolderCollapse(folder.path);
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
    const actualFilePath = await createFile(folder.path, fileName);
    console.log("文件创建成功:", actualFilePath);
  };

  const handleStartRename = () => {
    setIsRenaming(true);
  };

  return (
    <div className="select-none">
      {/* 文件夹主行 */}
      {isRenaming ? (
        <RenameInput initialName={folder.name} level={level} onRename={handleRename} onCancel={handleCancelRename} />
      ) : (
        <div className="group hover:bg-muted/50 relative flex items-center gap-1 rounded-md px-2 py-1 transition-colors duration-200">
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

      {/* 子项（文件夹展开时显示） */}
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
