import { useFilesStore } from "@renderer/stores";

/**
 * Files 状态管理 Hook
 */
export function useFilesState() {
  const {
    fileTree,
    currentFile,
    workspace,
    loadFileTree,
    selectNode,
    openFile,
    closeFile,
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

  const hasContent = fileTree.nodes.length > 0;

  return {
    selectedPath: fileTree.selectedNode?.path || null,
    selectedType: fileTree.selectedNode?.type || null,
    isFileSelected: fileTree.selectedNode?.type === "file",
    isFolderSelected: fileTree.selectedNode?.type === "folder",

    openedFilePath: currentFile.filePath,
    fileContent: currentFile.content,

    fileTree: fileTree.nodes,
    hasContent,
    isLoading: fileTree.loading,
    expandedFolders: fileTree.expandedPaths,
    workspacePath: workspace.config.workspacePath,

    selectNode,
    openFile,
    closeFile,
    loadFileTree,
    saveFileContent,
    createFile,
    createFolder,
    renameFile,
    deleteFile,
    toggleFolder,
    refreshFileTree,
    searchFiles,
    clearSearch
  };
}
