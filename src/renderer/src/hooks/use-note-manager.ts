import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTabStore, useFilesStore } from "@renderer/stores";
import { filesApi } from "@renderer/api";
import {
  createFileNoteId,
  createEmptyNoteFile,
  generateUniqueFileName,
  getTitleFromFileName
} from "@renderer/types/file-content";
import type { NoteFileContent } from "@renderer/types/file-content";
import { NOTE_CONSTANTS } from "@renderer/constants/note-constants";
import { ErrorHandler, AppError, ErrorType } from "@renderer/lib/error-handler";

/**
 * 笔记管理 Hook
 * 提供创建、打开笔记的统一接口
 */
export function useNoteManager() {
  const navigate = useNavigate();
  const { openTab } = useTabStore();
  const { workspace } = useFilesStore();

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
    async (options?: { baseName?: string; template?: NoteFileContent; openInNewTab?: boolean }): Promise<string> => {
      const { baseName, template, openInNewTab = true } = options || {};

      try {
        if (!workspace.config.workspacePath) {
          throw new AppError("工作区路径未设置", ErrorType.VALIDATION);
        }

        // 生成文件名
        const fileName = generateNoteFileName(baseName);

        // 创建笔记内容
        const noteContent = template || createEmptyNoteFile(getTitleFromFileName(fileName));

        // 创建文件（不刷新文件树以提高性能）
        const { createNewFileNoRefresh } = useFilesStore.getState();
        const actualFilePath = await createNewFileNoRefresh(
          fileName,
          JSON.stringify(noteContent, null, NOTE_CONSTANTS.JSON_INDENT)
        );

        // 生成文件 noteId
        const fileNoteId = createFileNoteId(actualFilePath);

        if (openInNewTab) {
          // 读取刚创建的笔记文件内容以确保一致性
          const savedNoteContent = await filesApi.readNoteFile(actualFilePath);

          // 打开标签页
          openTab(fileNoteId, savedNoteContent.metadata.title, "note");

          // 导航到笔记页面
          navigate({ to: "/notes/$noteId", params: { noteId: fileNoteId } });
        }

        // 显示成功提示
        ErrorHandler.success("笔记创建成功");

        return fileNoteId;
      } catch (error) {
        // 使用统一错误处理
        ErrorHandler.handle(error, "创建笔记");
        throw error;
      }
    },
    [workspace.config.workspacePath, generateNoteFileName, openTab, navigate]
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
    generateNoteFileName
  };
}
