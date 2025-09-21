import { useState, useEffect } from "react";
import { useTabStore } from "@renderer/stores/tab-store";
import { filesApi } from "@renderer/api";
import { isFileNoteId, getFilePathFromNoteId } from "@renderer/types/file-content";
import type { NoteFileContent } from "@renderer/types/file-content";

/**
 * 获取当前活跃笔记的 Hook
 * 处理文件模式和数据库模式的笔记加载
 */
export function useActiveNote() {
  const { activeTabId, openTabs } = useTabStore();
  const [noteData, setNoteData] = useState<NoteFileContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 获取当前活跃标签信息
  const currentTab = activeTabId ? openTabs.find((tab) => tab.id === activeTabId) : null;

  useEffect(() => {
    const loadNote = async () => {
      if (!activeTabId) {
        setNoteData(null);
        setError(null);
        return;
      }

      // 如果是设置页面，不需要加载笔记数据
      if (currentTab?.type === "settings") {
        setNoteData(null);
        setError(null);
        return;
      }

      // 处理文件模式的笔记
      if (isFileNoteId(activeTabId)) {
        setIsLoading(true);
        setError(null);

        try {
          const filePath = getFilePathFromNoteId(activeTabId);
          const noteContent = await filesApi.readNoteFile(filePath);
          setNoteData(noteContent);
        } catch (err) {
          const error = err instanceof Error ? err : new Error("加载笔记失败");
          setError(error);
          setNoteData(null);
          console.error("加载笔记文件失败:", error);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // 处理数据库模式的笔记（暂时未实现）
      // TODO: 实现数据库模式的笔记加载逻辑
      setNoteData(null);
      setError(null);
    };

    loadNote();
  }, [activeTabId, currentTab?.type]);

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
