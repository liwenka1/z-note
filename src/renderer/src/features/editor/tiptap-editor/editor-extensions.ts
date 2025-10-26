import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";

/**
 * 编辑器扩展配置
 * 将TipTap编辑器的扩展配置抽离到单独文件
 *
 * 🚧 待添加的扩展（占位功能）：
 * - Underline - 下划线
 * - Highlight - 高亮颜色
 * - Superscript - 上标
 * - Subscript - 下标
 * - TextAlign - 文本对齐
 * - Image - 图片上传
 * - TaskList & TaskItem - 任务列表
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
    Typography

    // 🚧 待添加扩展示例：
    // Underline,
    // Highlight.configure({ multicolor: true }),
    // Superscript,
    // Subscript,
    // TextAlign.configure({ types: ['heading', 'paragraph'] }),
    // Image,
    // TaskList,
    // TaskItem.configure({ nested: true }),
  ];
}
