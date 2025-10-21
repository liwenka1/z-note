import { useEffect, useState, useCallback } from "react";
import { useNote } from "@renderer/hooks";
import { useEditorStore } from "@renderer/stores";
import { filesApi } from "@renderer/api";
import { isFileNoteId, getFilePathFromNoteId } from "@renderer/utils/file-content";
import type { JSONContent } from "@tiptap/react";
import type { NoteFileContent } from "@renderer/types/file-content";

interface FileNoteState {
  id: string;
  title: string;
  content: string;
  jsonContent: JSONContent;
  metadata: NoteFileContent["metadata"];
}

/**
 * Editor 状态管理 Hook
 * 支持数据库和文件系统双模式
 *
 * 职责：
 * 1. 加载笔记数据（文件/数据库）
 * 2. 提供初始内容给编辑器
 * 3. 处理保存逻辑
 */
export function useEditorState(noteId: string) {
  const [fileNote, setFileNote] = useState<FileNoteState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isFileMode = isFileNoteId(noteId);

  // 数据库模式：使用原有的查询
  const { data: dbNote, isLoading: dbLoading } = useNote(isFileMode ? 0 : parseInt(noteId) || 0);

  const { getNoteContent, saveNote } = useEditorStore();

  // 文件模式：加载文件内容
  useEffect(() => {
    if (isFileMode) {
      const loadFileNote = async () => {
        setIsLoading(true);

        try {
          const filePath = getFilePathFromNoteId(noteId);
          const noteContent = await filesApi.readNoteFile(filePath);

          setFileNote({
            id: noteId,
            title: noteContent.metadata.title,
            content: JSON.stringify(noteContent.content),
            jsonContent: noteContent.content,
            metadata: noteContent.metadata
          });
        } catch (err) {
          console.error("Failed to load file note:", err);
        } finally {
          setIsLoading(false);
        }
      };

      loadFileNote();
    }
  }, [noteId, isFileMode]);

  // 当前笔记对象
  const note = isFileMode ? fileNote : dbNote;

  // 确定初始内容 - 确保总是返回有效的文档结构
  let initialContent: JSONContent;

  if (isFileMode && fileNote?.jsonContent) {
    // 文件模式：直接使用文件内容（已在 createEmptyNoteFile 中规范化）
    initialContent = fileNote.jsonContent;
  } else if (!isFileMode && note?.content) {
    // 数据库模式：假设原来存储的是 HTML，需要转换
    // 这里可能需要额外的转换逻辑
    initialContent = {
      type: "doc",
      content: [{ type: "paragraph" }]
    };
  } else {
    // 默认空文档
    initialContent = {
      type: "doc",
      content: [{ type: "paragraph" }]
    };
  }

  const handleSave = useCallback(async () => {
    // 从 store 获取当前编辑器的内容
    const currentContent = getNoteContent(noteId);
    if (!currentContent) return;

    if (isFileMode) {
      try {
        const filePath = getFilePathFromNoteId(noteId);
        await filesApi.updateNoteFile(filePath, currentContent);
        saveNote(noteId); // 更新本地状态为已保存
      } catch (err) {
        console.error("Failed to save file note:", err);
        throw new Error("保存文件失败");
      }
    } else {
      // 数据库模式的保存逻辑
      // 这里需要将 JSON 转换回 HTML 并调用原有的保存 API
      saveNote(noteId);
    }
  }, [noteId, isFileMode, getNoteContent, saveNote]);

  return {
    note,
    initialContent,
    handleSave,
    isLoading: isFileMode ? isLoading : dbLoading
  };
}
