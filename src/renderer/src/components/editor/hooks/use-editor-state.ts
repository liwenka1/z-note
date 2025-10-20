import { useEffect, useState } from "react";
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
 */
export function useEditorState(noteId: string) {
  const [fileNote, setFileNote] = useState<FileNoteState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFileMode = isFileNoteId(noteId);

  // 数据库模式：使用原有的查询
  const { data: dbNote, isLoading: dbLoading } = useNote(isFileMode ? 0 : parseInt(noteId) || 0);

  const { startEditing, getEditingContent, updateContent, saveNote } = useEditorStore();

  // 文件模式：加载文件内容
  useEffect(() => {
    if (isFileMode) {
      const loadFileNote = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const filePath = getFilePathFromNoteId(noteId);
          const noteContent = await filesApi.readNoteFile(filePath);

          setFileNote({
            id: noteId,
            title: noteContent.metadata.title,
            content: JSON.stringify(noteContent.content), // 临时转换为字符串以兼容现有接口
            jsonContent: noteContent.content,
            metadata: noteContent.metadata
          });
        } catch (err) {
          console.error("Failed to load file note:", err);
          setError("加载笔记失败");
        } finally {
          setIsLoading(false);
        }
      };

      loadFileNote();
    }
  }, [noteId, isFileMode]);

  // 当前笔记对象
  const note = isFileMode ? fileNote : dbNote;

  // 获取编辑内容
  const editingContent = getEditingContent(noteId);

  // 确定最终显示的内容
  let finalContent: JSONContent;
  if (editingContent) {
    finalContent = editingContent;
  } else if (isFileMode && fileNote?.jsonContent) {
    finalContent = fileNote.jsonContent;
  } else if (!isFileMode && note?.content) {
    // 数据库模式：假设原来存储的是 HTML，需要转换
    // 这里可能需要额外的转换逻辑
    finalContent = { type: "doc", content: [] }; // 临时的空内容
  } else {
    finalContent = { type: "doc", content: [] };
  }

  // 初始化编辑状态
  useEffect(() => {
    if (note && !editingContent) {
      if (isFileMode && fileNote?.jsonContent) {
        // 为文件模式启动编辑，深拷贝确保对象引用独立
        startEditing(noteId, structuredClone(fileNote.jsonContent));
      } else if (!isFileMode && note?.content) {
        // 对于数据库模式，需要将 HTML 转换为 JSON
        // 临时使用空内容，后续可以实现 HTML 到 JSON 的转换
        startEditing(noteId, { type: "doc", content: [] });
      }
    }
  }, [note, noteId, editingContent, startEditing, isFileMode, fileNote]);

  const handleContentChange = (content: JSONContent) => {
    updateContent(noteId, content);
  };

  const handleSave = async () => {
    const currentContent = getEditingContent(noteId);
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
  };

  return {
    note,
    editingContent: finalContent,
    handleContentChange,
    handleSave,
    isLoading: isFileMode ? isLoading : dbLoading,
    error
  };
}
