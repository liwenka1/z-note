import { useRef } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@renderer/components/ui/resizable";
import { MonacoEditor } from "../monaco-editor/monaco-editor";
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
  const editorRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // 同步滚动处理
  const handleEditorScroll = (scrollTop: number) => {
    if (syncScroll && previewRef.current) {
      // 简单的比例映射，实际项目中可能需要更复杂的算法
      const scrollRatio = scrollTop / (editorRef.current?.scrollHeight || 1);
      const previewScrollTop = scrollRatio * (previewRef.current?.scrollHeight || 0);
      previewRef.current.scrollTop = previewScrollTop;
    }
  };

  const handlePreviewScroll = (scrollTop: number) => {
    if (syncScroll && editorRef.current) {
      // 反向同步
      const scrollRatio = scrollTop / (previewRef.current?.scrollHeight || 1);
      const editorScrollTop = scrollRatio * (editorRef.current?.scrollHeight || 0);
      editorRef.current.scrollTop = editorScrollTop;
    }
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
        <div
          ref={editorRef}
          className="h-full overflow-hidden"
          onScroll={(e) => handleEditorScroll(e.currentTarget.scrollTop)}
        >
          <MonacoEditor value={value} onChange={onChange} onSave={onSave} className="h-full" />
        </div>
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel id="preview-panel" minSize={20} maxSize={80}>
        <div
          ref={previewRef}
          className="h-full overflow-hidden"
          onScroll={(e) => handlePreviewScroll(e.currentTarget.scrollTop)}
        >
          <MarkdownPreview content={value} className="h-full" />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
