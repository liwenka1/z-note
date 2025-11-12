import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTabStore, useFilesStore } from "@renderer/stores";
import { useCreateNoteFile } from "@renderer/hooks/mutations/use-file-mutations";
import { filesApi } from "@renderer/api";
import { createFileNoteId, generateUniqueFileName } from "@renderer/utils/file-content";
import { NOTE_CONSTANTS } from "@renderer/constants/note-constants";
import { ErrorHandler, AppError, ErrorType } from "@renderer/lib/error-handler";

/**
 * 笔记管理 Hook
 * 使用 React Query mutations 处理笔记创建
 */
export function useNoteManager() {
  const navigate = useNavigate();
  const { openTab } = useTabStore();
  const { workspace } = useFilesStore();
  const createNoteMutation = useCreateNoteFile();

  /**
   * 生成唯一的笔记文件名
   */
  const generateNoteFileName = useCallback((baseName: string = NOTE_CONSTANTS.DEFAULT_NOTE_PREFIX): string => {
    return generateUniqueFileName(baseName);
  }, []);

  /**
   * 创建并打开新笔记
   * @param options 创建选项
   * @returns Promise<string> 返回创建的笔记ID
   */
  const createAndOpenNote = useCallback(
    async (options?: { baseName?: string; openInNewTab?: boolean }): Promise<string> => {
      const { baseName, openInNewTab = true } = options || {};

      if (!workspace.config.workspacePath) {
        throw new AppError("工作区路径未设置", ErrorType.VALIDATION);
      }

      const fileName = generateNoteFileName(baseName);

      const { createFile } = useFilesStore.getState();
      const actualFilePath = await createFile(workspace.config.workspacePath, fileName);

      // 使用 mutation 更新缓存（不等待完成）
      createNoteMutation.mutate({ filePath: actualFilePath });

      // 生成文件 noteId
      const fileNoteId = createFileNoteId(actualFilePath);

      if (openInNewTab) {
        // 读取刚创建的笔记文件
        const savedNoteContent = await filesApi.readNoteFile(actualFilePath);

        // 打开标签页
        openTab(fileNoteId, savedNoteContent.metadata.title, "note");

        // 导航到笔记页面
        navigate({ to: "/notes/$noteId", params: { noteId: fileNoteId } });
      }

      return fileNoteId;
    },
    [workspace.config.workspacePath, generateNoteFileName, openTab, navigate, createNoteMutation]
  );

  /**
   * 打开已存在的笔记
   * @param noteId 笔记ID
   * @param title 笔记标题（可选，如果不提供会尝试从文件读取）
   */
  const openNote = useCallback(
    async (noteId: string, title?: string): Promise<void> => {
      try {
        let noteTitle = title;

        // 如果没有提供标题，尝试从文件读取
        if (!noteTitle && noteId.startsWith("file:")) {
          const filePath = noteId.replace("file:", "");
          const noteContent = await filesApi.readNoteFile(filePath);
          noteTitle = noteContent.metadata.title;
        }

        // 打开标签页
        openTab(noteId, noteTitle || "未知笔记", "note");

        // 导航到笔记页面
        navigate({ to: "/notes/$noteId", params: { noteId } });
      } catch (error) {
        // 使用统一错误处理
        ErrorHandler.handle(error, "打开笔记");
        throw error;
      }
    },
    [openTab, navigate]
  );

  /**
   * 快速创建笔记（使用默认设置）
   */
  const quickCreateNote = useCallback(async (): Promise<string | undefined> => {
    return await createAndOpenNote();
  }, [createAndOpenNote]);

  return {
    createAndOpenNote,
    openNote,
    quickCreateNote,
    generateNoteFileName,
    isCreating: createNoteMutation.isPending
  };
}
