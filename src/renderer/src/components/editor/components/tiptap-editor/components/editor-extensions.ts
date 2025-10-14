import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";

/**
 * 编辑器扩展配置
 * 将TipTap编辑器的扩展配置抽离到单独文件
 */
export function createEditorExtensions(placeholder = "开始写作...") {
  return [
    StarterKit.configure({
      // 禁用 StarterKit 中的 Link 扩展，使用我们自定义的
      link: false
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
    Typography
  ];
}
