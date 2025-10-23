import { useEffect } from "react";
import { FilesHeader } from "./files-header";
import { FolderTree } from "./folder-tree";
import { EmptyFiles } from "./empty-files";
import { useFilesState } from "./hooks/use-files-state";
import { useFilesStore } from "@renderer/stores";

/**
 * Files 主组件
 * 参考 chat 的模式，组合所有子组件
 */
export function FilesPanel() {
  const { hasContent } = useFilesState();
  const loadFileTree = useFilesStore.getState().loadFileTree;

  // 初始化工作区 - 组件首次挂载时加载文件树
  useEffect(() => {
    loadFileTree(true);
  }, [loadFileTree]);

  return (
    <div className="bg-background flex h-full flex-col">
      <FilesHeader />

      <div className="flex-1 overflow-hidden">{hasContent ? <FolderTree /> : <EmptyFiles />}</div>
    </div>
  );
}
