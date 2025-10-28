import { useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";

/**
 * 编辑器激活状态类型
 */
export interface EditorActiveState {
  // Heading states
  isParagraph: boolean;
  isHeading1: boolean;
  isHeading2: boolean;
  isHeading3: boolean;
  isHeading4: boolean;

  // Format states
  isBold: boolean;
  isItalic: boolean;
  isStrike: boolean;
  isCode: boolean;
  isCodeBlock: boolean;
  isUnderline: boolean;
  isSuperscript: boolean;
  isSubscript: boolean;
  isHighlight: boolean;

  // List states
  isBulletList: boolean;
  isOrderedList: boolean;
  isTaskList: boolean;
  isBlockquote: boolean;

  // Alignment states
  isAlignLeft: boolean;
  isAlignCenter: boolean;
  isAlignRight: boolean;
  isAlignJustify: boolean;

  // History states
  canUndo: boolean;
  canRedo: boolean;
}

/**
 * 用于订阅编辑器的激活状态
 * 基于官方的 useEditorState hook，确保组件在编辑器状态改变时重新渲染
 *
 * @example
 * ```tsx
 * function HeadingControls({ editor }: { editor: Editor | null }) {
 *   const { isHeading1, isHeading2, isParagraph } = useEditorActiveState(editor);
 *
 *   return (
 *     <button className={isHeading1 ? 'active' : ''}>H1</button>
 *   );
 * }
 * ```
 */
export function useEditorActiveState(editor: Editor | null): EditorActiveState {
  const state = useEditorState({
    editor,
    selector: (ctx): EditorActiveState => {
      if (!ctx.editor) {
        return {
          // Heading states
          isParagraph: false,
          isHeading1: false,
          isHeading2: false,
          isHeading3: false,
          isHeading4: false,

          // Format states
          isBold: false,
          isItalic: false,
          isStrike: false,
          isCode: false,
          isCodeBlock: false,
          isUnderline: false,
          isSuperscript: false,
          isSubscript: false,
          isHighlight: false,

          // List states
          isBulletList: false,
          isOrderedList: false,
          isTaskList: false,
          isBlockquote: false,

          // Alignment states
          isAlignLeft: false,
          isAlignCenter: false,
          isAlignRight: false,
          isAlignJustify: false,

          // History states
          canUndo: false,
          canRedo: false
        };
      }

      return {
        // Heading states
        isParagraph: ctx.editor.isActive("paragraph"),
        isHeading1: ctx.editor.isActive("heading", { level: 1 }),
        isHeading2: ctx.editor.isActive("heading", { level: 2 }),
        isHeading3: ctx.editor.isActive("heading", { level: 3 }),
        isHeading4: ctx.editor.isActive("heading", { level: 4 }),

        // Format states
        isBold: ctx.editor.isActive("bold"),
        isItalic: ctx.editor.isActive("italic"),
        isStrike: ctx.editor.isActive("strike"),
        isCode: ctx.editor.isActive("code"),
        isCodeBlock: ctx.editor.isActive("codeBlock"),
        isUnderline: ctx.editor.isActive("underline"),
        isSuperscript: ctx.editor.isActive("superscript"),
        isSubscript: ctx.editor.isActive("subscript"),
        isHighlight: ctx.editor.isActive("highlight"),

        // List states
        isBulletList: ctx.editor.isActive("bulletList"),
        isOrderedList: ctx.editor.isActive("orderedList"),
        isTaskList: ctx.editor.isActive("taskList"),
        isBlockquote: ctx.editor.isActive("blockquote"),

        // Alignment states
        isAlignLeft:
          ctx.editor.isActive({ textAlign: "left" }) ||
          (!ctx.editor.isActive({ textAlign: "center" }) &&
            !ctx.editor.isActive({ textAlign: "right" }) &&
            !ctx.editor.isActive({ textAlign: "justify" })),
        isAlignCenter: ctx.editor.isActive({ textAlign: "center" }),
        isAlignRight: ctx.editor.isActive({ textAlign: "right" }),
        isAlignJustify: ctx.editor.isActive({ textAlign: "justify" }),

        // History states
        canUndo: ctx.editor.can().undo(),
        canRedo: ctx.editor.can().redo()
      };
    }
  });

  // useEditorState 可能返回 null，但我们已经在 selector 中处理了 null 情况
  // 所以这里可以安全地返回，如果是 null 就返回默认值
  return (
    state ?? {
      isParagraph: false,
      isHeading1: false,
      isHeading2: false,
      isHeading3: false,
      isHeading4: false,
      isBold: false,
      isItalic: false,
      isStrike: false,
      isCode: false,
      isCodeBlock: false,
      isUnderline: false,
      isSuperscript: false,
      isSubscript: false,
      isHighlight: false,
      isBulletList: false,
      isOrderedList: false,
      isTaskList: false,
      isBlockquote: false,
      isAlignLeft: false,
      isAlignCenter: false,
      isAlignRight: false,
      isAlignJustify: false,
      canUndo: false,
      canRedo: false
    }
  );
}
