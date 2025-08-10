import type { editor } from "monaco-editor";

// Monaco Editor 基础配置
export const defaultEditorOptions: editor.IStandaloneEditorConstructionOptions = {
  language: "markdown",
  theme: "vs-dark",
  fontSize: 14,
  fontFamily: "'Cascadia Code', 'Fira Code', 'Monaco', 'Menlo', monospace",
  lineHeight: 1.6,
  wordWrap: "on",
  wordWrapColumn: 80,
  wrappingIndent: "indent",
  minimap: {
    enabled: true,
    side: "right",
    showSlider: "mouseover"
  },
  scrollBeyondLastLine: false,
  renderWhitespace: "selection",
  folding: true,
  foldingStrategy: "indentation",
  showFoldingControls: "mouseover",
  lineNumbers: "on",
  glyphMargin: true,
  automaticLayout: true,
  tabSize: 2,
  insertSpaces: true,
  detectIndentation: true,
  trimAutoWhitespace: true,
  find: {
    addExtraSpaceOnTop: false,
    autoFindInSelection: "never",
    seedSearchStringFromSelection: "always"
  },
  suggest: {
    showKeywords: true,
    showSnippets: true,
    showWords: true
  },
  quickSuggestions: {
    other: true,
    comments: true,
    strings: true
  },
  parameterHints: {
    enabled: true
  },
  cursorBlinking: "blink",
  cursorSmoothCaretAnimation: "on",
  smoothScrolling: true,
  mouseWheelZoom: true,
  contextmenu: true,
  copyWithSyntaxHighlighting: true
};

// Markdown 语言特定配置
export const markdownLanguageConfig = {
  // 代码折叠规则
  foldingRules: {
    markers: {
      start: new RegExp("^\\s*<!--\\s*#?region\\b.*-->"),
      end: new RegExp("^\\s*<!--\\s*#?endregion\\b.*-->")
    }
  },
  // 自动补全配置
  completion: {
    triggerCharacters: ["#", "*", "_", "`", "[", "("]
  }
};

// 主题相关配置
export const themeConfig = {
  light: "vs",
  dark: "vs-dark"
  // 可以在这里添加自定义主题
};

// 快捷键配置
export const keyBindings = {
  // Ctrl+S: 保存
  save: "ctrl+s",
  // Ctrl+F: 查找
  find: "ctrl+f",
  // Ctrl+H: 替换
  replace: "ctrl+h",
  // Ctrl+G: 跳转到行
  gotoLine: "ctrl+g",
  // Ctrl+/: 切换注释
  toggleComment: "ctrl+/",
  // Alt+Z: 切换自动换行
  toggleWordWrap: "alt+z",
  // Ctrl+Shift+P: 命令面板
  commandPalette: "ctrl+shift+p"
};
