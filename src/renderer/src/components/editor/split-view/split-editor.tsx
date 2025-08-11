import { useRef } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@renderer/components/ui/resizable";
import { MonacoEditor, MonacoEditorRef } from "../monaco-editor/monaco-editor";
import { MarkdownPreview } from "../preview/markdown-preview";
import { useEditorStore } from "@renderer/store/editor-store";

interface SplitEditorProps {
  noteId: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
}

export function SplitEditor({ value, onChange, onSave }: SplitEditorProps) {
  const { viewMode, splitRatio, syncScroll, setSplitRatio } = useEditorStore();
  const editorRef = useRef<MonacoEditorRef>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isSyncingRef = useRef(false);

  // 计算精确的滚动比例
  const calculateScrollRatio = (scrollTop: number, scrollHeight: number, clientHeight: number) => {
    const maxScroll = scrollHeight - clientHeight;
    return maxScroll > 0 ? scrollTop / maxScroll : 0;
  };

  // 使用RAF执行同步，防止循环触发
  const syncWithRAF = (callback: () => void) => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    callback();
    requestAnimationFrame(() => {
      isSyncingRef.current = false;
    });
  };

  // Monaco Editor 滚动处理
  const handleEditorScroll = (scrollTop: number, scrollHeight: number, clientHeight: number) => {
    if (!syncScroll || !previewRef.current) return;

    syncWithRAF(() => {
      const previewElement = previewRef.current!;

      const scrollRatio = calculateScrollRatio(scrollTop, scrollHeight, clientHeight);

      const maxPreviewScroll = previewElement.scrollHeight - previewElement.clientHeight;
      const previewScrollTop = scrollRatio * maxPreviewScroll;

      previewElement.scrollTop = previewScrollTop;
    });
  };

  // Preview 滚动处理
  const handlePreviewScroll = (scrollTop: number) => {
    if (!syncScroll || !previewRef.current || !editorRef.current) return;

    syncWithRAF(() => {
      const previewElement = previewRef.current!;

      const scrollRatio = calculateScrollRatio(scrollTop, previewElement.scrollHeight, previewElement.clientHeight);

      // 使用 editorRef 来设置 Monaco Editor 的滚动位置
      const monacoEditor = editorRef.current!.getEditor();
      if (monacoEditor) {
        const editorScrollHeight = monacoEditor.getScrollHeight();
        const editorClientHeight = monacoEditor.getLayoutInfo().height;
        const maxEditorScroll = editorScrollHeight - editorClientHeight;
        const editorScrollTop = scrollRatio * maxEditorScroll;

        monacoEditor.setScrollTop(editorScrollTop);
      }
    });
  };

  // 根据视图模式渲染不同的布局
  if (viewMode === "edit") {
    return (
      <div className="h-full">
        <MonacoEditor value={value} onChange={onChange} onSave={onSave} className="h-full" />
      </div>
    );
  }

  if (viewMode === "preview") {
    return (
      <div className="h-full">
        <MarkdownPreview content={value} className="h-full" />
      </div>
    );
  }

  // 分屏模式
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel
        id="editor-panel"
        defaultSize={splitRatio * 100}
        minSize={20}
        maxSize={80}
        onResize={(size) => setSplitRatio(size / 100)}
      >
        <MonacoEditor
          ref={editorRef}
          value={value}
          onChange={onChange}
          onSave={onSave}
          onScroll={handleEditorScroll}
          className="h-full"
        />
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel id="preview-panel" minSize={20} maxSize={80}>
        <MarkdownPreview ref={previewRef} content={value} onScroll={handlePreviewScroll} className="h-full" />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
