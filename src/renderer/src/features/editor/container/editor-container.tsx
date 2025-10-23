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
  const { activeNoteId, setActiveNote, getEditor } = useEditorStore();

  const isActive = activeNoteId === noteId;

  // 当容器激活时，更新 store 中的 activeNoteId 并自动聚焦
  useEffect(() => {
    if (!isActive) return;

    setActiveNote(noteId);

    // 自动聚焦到编辑器
    const tryFocus = () => {
      const editor = getEditor(noteId);
      if (editor && !editor.isDestroyed) {
        // 检查编辑器 view 是否已挂载
        if (editor.view?.dom?.parentNode) {
          editor.commands.focus("end");
          return true;
        }
      }
      return false;
    };

    // 先立即尝试聚焦
    if (tryFocus()) return;

    // 如果立即聚焦失败，使用轮询重试（最多尝试10次，每次间隔10ms）
    let attempts = 0;
    const maxAttempts = 10;
    const interval = 10;

    const timer = setInterval(() => {
      attempts++;
      if (tryFocus() || attempts >= maxAttempts) {
        clearInterval(timer);
      }
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [isActive, noteId, setActiveNote, getEditor]);

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
