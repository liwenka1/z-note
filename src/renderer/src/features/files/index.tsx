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
  const { initializeWorkspace, workspace } = useFilesStore();

  // 初始化工作区 - 组件首次挂载时初始化工作区和加载文件树
  useEffect(() => {
    if (!workspace.initialized && !workspace.loading) {
      initializeWorkspace();
    }
  }, [initializeWorkspace, workspace.initialized, workspace.loading]);

  return (
    <div className="flex h-full flex-col">
      <FilesHeader />

      <div className="flex-1 overflow-hidden">{hasContent ? <FolderTree /> : <EmptyFiles />}</div>
    </div>
  );
}
