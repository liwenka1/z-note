import { useMemo } from "react";
import { useTabStore } from "@renderer/stores";
import { useNoteFile } from "@renderer/hooks/queries/use-files";
import { isFileNoteId, getFilePathFromNoteId } from "@renderer/utils/file-content";

/**
 * 获取当前活跃笔记的 Hook
 * 使用 React Query 自动管理加载状态和缓存
 */
export function useActiveNote() {
  const { activeTabId, openTabs } = useTabStore();

  // 获取当前活跃标签信息
  const currentTab = activeTabId ? openTabs.find((tab) => tab.id === activeTabId) : null;

  // 判断是否为文件模式笔记
  const isFileNote = activeTabId ? isFileNoteId(activeTabId) : false;
  const isSettingsTab = currentTab?.type === "settings";

  // 获取文件路径
  const filePath = useMemo(() => {
    if (!activeTabId || !isFileNote || isSettingsTab) return null;
    return getFilePathFromNoteId(activeTabId);
  }, [activeTabId, isFileNote, isSettingsTab]);

  // 使用 React Query 加载笔记文件
  const { data: noteData, isLoading, error } = useNoteFile(filePath, !!filePath);

  return {
    /** 当前活跃的笔记数据 */
    noteData,
    /** 当前活跃的标签信息 */
    currentTab,
    /** 是否正在加载 */
    isLoading,
    /** 加载错误 */
    error,
    /** 笔记标题（优先使用标签标题，fallback 到笔记元数据标题） */
    noteTitle: currentTab?.title || noteData?.metadata?.title || "未知笔记",
    /** 是否为文件模式的笔记 */
    isFileNote: activeTabId ? isFileNoteId(activeTabId) : false,
    /** 是否为设置页面 */
    isSettingsTab: currentTab?.type === "settings"
  };
}
