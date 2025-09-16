import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FilesHeader } from "./components/files-header";
import { FolderTree } from "./components/folder-tree";
import { EmptyFiles } from "./components/empty-files";
import { useFilesState } from "./hooks/use-files-state";
import { useFilesStore } from "@renderer/stores/files-store";
import { DEFAULT_WORKSPACE_PATH } from "@renderer/config/workspace";

/**
 * Files 主组件
 * 参考 chat 的模式，组合所有子组件
 */
export function FilesPanel() {
  const { hasContent, workspacePath } = useFilesState();
  const { loadFileTree, workspace } = useFilesStore();

  // 初始化工作区
  const initializeWorkspace = useCallback(async () => {
    // 如果没有设置工作区路径，设置默认路径
    if (!workspacePath) {
      // 使用统一的默认工作区路径配置
      const defaultWorkspacePath = DEFAULT_WORKSPACE_PATH;

      // 使用immer方式更新状态
      useFilesStore.setState((state) => ({
        ...state,
        workspace: {
          ...state.workspace,
          config: {
            ...state.workspace.config,
            workspacePath: defaultWorkspacePath
          },
          initialized: true
        }
      }));

      // 延迟加载文件树，确保状态更新完成
      setTimeout(() => loadFileTree(), 100);
    } else if (!workspace.initialized) {
      // 如果有路径但未初始化，则初始化
      await loadFileTree();
      useFilesStore.setState((state) => ({
        ...state,
        workspace: {
          ...state.workspace,
          initialized: true
        }
      }));
    }
  }, [workspacePath, workspace.initialized, loadFileTree]);

  useEffect(() => {
    initializeWorkspace();
  }, [initializeWorkspace]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="bg-background flex h-full flex-col"
    >
      <FilesHeader />

      <div className="flex-1 overflow-hidden">{hasContent ? <FolderTree /> : <EmptyFiles />}</div>
    </motion.div>
  );
}
