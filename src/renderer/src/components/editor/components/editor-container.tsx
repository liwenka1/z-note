import { useEffect } from "react";
import { useEditorStore } from "@renderer/stores/editor-store";

interface EditorContainerProps {
  noteId: string;
  children: React.ReactNode;
}

/**
 * 编辑器容器组件
 * 负责管理单个编辑器实例的显示/隐藏
 * 参考 VSCode 的 Editor Group 概念
 */
export function EditorContainer({ noteId, children }: EditorContainerProps) {
  const { activeNoteId, setActiveNote } = useEditorStore();

  const isActive = activeNoteId === noteId;

  // 当容器激活时，更新 store 中的 activeNoteId
  useEffect(() => {
    if (isActive) {
      setActiveNote(noteId);
    }
  }, [isActive, noteId, setActiveNote]);

  return (
    <div
      data-note-id={noteId}
      style={{
        display: isActive ? "flex" : "none",
        flexDirection: "column",
        height: "100%",
        width: "100%"
      }}
    >
      {children}
    </div>
  );
}
