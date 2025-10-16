import { useFilesStore } from "@renderer/stores";

/**
 * Files 状态管理 Hook
 * 基于文件系统的纯文件管理（参考 NoteGen 架构）
 */
export function useFilesState() {
  const {
    // 文件系统状态
    fileTree,
    currentFile,
    workspace,

    // 操作方法
    loadFileTree,
    selectFile,
    saveFileContent,
    createFile,
    createFolder,
    renameFile,
    deleteFile,
    toggleFolder,
    refreshFileTree,
    searchFiles,
    clearSearch
  } = useFilesStore();

  // 检查是否有内容
  const hasContent = fileTree.nodes.length > 0;

  // 获取文件夹和文件列表（兼容现有组件）
  const folders = fileTree.nodes.filter((node) => node.isDirectory);
  const files = fileTree.nodes.filter((node) => !node.isDirectory);

  return {
    // 文件系统状态
    fileTree: fileTree.nodes,
    selectedFile: currentFile.filePath,
    currentContent: currentFile.content,
    hasContent,
    isLoading: fileTree.loading,
    expandedFolders: fileTree.expandedPaths,
    workspacePath: workspace.config.workspacePath,

    // 分类数据（兼容现有组件）
    folders,
    files,
    activeFolders: folders,
    activeNotes: files,

    // 操作方法
    loadFileTree,
    selectFile,
    saveCurrentFile: saveFileContent,
    createFile,
    createFolder,
    renameFile,
    deleteFile,
    toggleFolderCollapse: toggleFolder,
    refreshFileTree,
    searchFiles,
    clearSearch,

    // 兼容性别名
    foldersLoading: fileTree.loading,
    notesLoading: fileTree.loading
  };
}
