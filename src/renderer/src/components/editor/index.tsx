import { useEffect, useMemo } from "react";
import { useTabStore, useEditorStore } from "@renderer/stores";
import { useEditorState } from "./hooks/use-editor-state";
import { TipTapEditor } from "./components/tiptap-editor";
import { EditorContainer } from "./components/editor-container";
import { NoteNotFound } from "./components/note-not-found";

/**
 * Editor 主组件
 *
 * 设计理念：参考 VSCode 的 Editor Group
 * - 所有打开的笔记都会创建独立的编辑器实例
 * - 通过 EditorContainer 控制显示/隐藏
 * - 切换笔记时不销毁编辑器实例
 * - 只在关闭 tab 时才销毁实例
 */
export function NoteEditor() {
  const { openTabs, activeTabId } = useTabStore();
  const { setActiveNote } = useEditorStore();

  // 过滤出笔记类型的 tabs
  const noteTabs = useMemo(() => openTabs.filter((tab) => tab.type === "note"), [openTabs]);

  // 同步激活的笔记 ID
  useEffect(() => {
    if (activeTabId) {
      setActiveNote(activeTabId);
    }
  }, [activeTabId, setActiveNote]);

  return (
    <div className="bg-background flex h-full w-full flex-col">
      {noteTabs.map((tab) => (
        <EditorContainer key={tab.id} noteId={tab.id}>
          <NoteEditorInstance noteId={tab.id} />
        </EditorContainer>
      ))}
    </div>
  );
}

/**
 * 单个笔记编辑器实例
 * 每个笔记都有独立的实例，互不干扰
 */
function NoteEditorInstance({ noteId }: { noteId: string }) {
  const { note, initialContent, handleSave, isLoading } = useEditorState(noteId);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-muted-foreground">加载笔记...</span>
      </div>
    );
  }

  if (!note) {
    return <NoteNotFound noteId={noteId} />;
  }

  return (
    <TipTapEditor
      noteId={noteId}
      initialContent={initialContent}
      onSave={handleSave}
      className="bg-background flex flex-1 flex-col"
    />
  );
}
