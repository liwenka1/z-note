import { useRef } from "react";
import Editor, { OnMount, OnChange } from "@monaco-editor/react";
import { useEditorStore } from "@renderer/store/editor-store";
import { useThemeStore } from "@renderer/store/theme-store";
import "./monaco-setup";

interface MonacoEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onSave?: () => void;
  className?: string;
}

export function MonacoEditor({ value, onChange, onSave, className }: MonacoEditorProps) {
  const { theme } = useThemeStore();
  const { editorSettings } = useEditorStore();
  const editorRef = useRef<unknown>(null);

  // 编辑器挂载回调
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // 注册保存快捷键
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave?.();
    });

    console.log("Monaco Editor 已成功挂载");
  };

  // 内容变化回调
  const handleEditorChange: OnChange = (value) => {
    if (value !== undefined) {
      onChange?.(value);
    }
  };

  return (
    <div className={className}>
      <Editor
        height="100%"
        defaultLanguage="markdown"
        language="markdown"
        value={value || ""}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{
          fontSize: editorSettings.fontSize,
          wordWrap: editorSettings.wordWrap ? "on" : "off",
          minimap: { enabled: editorSettings.minimap },
          lineNumbers: editorSettings.lineNumbers ? "on" : "off",
          tabSize: editorSettings.tabSize,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "blink"
        }}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        loading={
          <div className="text-muted-foreground flex h-full w-full items-center justify-center">加载编辑器...</div>
        }
      />
    </div>
  );
}
