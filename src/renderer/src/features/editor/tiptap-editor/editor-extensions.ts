import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

/**
 * 编辑器扩展配置
 * 将TipTap编辑器的扩展配置抽离到单独文件
 */
export function createEditorExtensions(placeholder = "开始写作...") {
  return [
    StarterKit.configure({
      // 禁用 StarterKit 中的 Link 扩展，使用我们自定义的
      link: false,
      heading: {
        levels: [1, 2, 3, 4]
      }
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "text-primary underline-offset-4 hover:underline"
      }
    }),
    Placeholder.configure({
      placeholder
    }),
    Typography,
    Underline,
    Superscript,
    Subscript,
    Highlight.configure({
      multicolor: true
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
      alignments: ["left", "center", "right", "justify"],
      defaultAlignment: "left"
    }),
    // 任务列表扩展
    TaskList,
    TaskItem.configure({
      nested: true
    })
  ];
}
