import { EditorContent, type Editor } from "@tiptap/react";
import { cn } from "@renderer/lib/utils";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@renderer/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface EditorContentAreaProps {
  editor: Editor | null;
  className?: string;
}

/**
 * 编辑器内容区域组件
 * 专门负责渲染编辑器内容，职责单一
 */
export function EditorContentArea({ editor, className }: EditorContentAreaProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 监听图片点击事件
  useEffect(() => {
    const handleImageClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        const img = target as HTMLImageElement;
        setPreviewImage(img.src);
      }
    };

    const editorElement = document.querySelector(".ProseMirror");
    if (editorElement) {
      editorElement.addEventListener("click", handleImageClick);
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener("click", handleImageClick);
      }
    };
  }, [editor]);

  return (
    <>
      <div
        className={cn(
          "prose prose-custom dark:prose-invert max-w-none",
          "min-h-full p-6",
          "focus-within:outline-none",
          className
        )}
      >
        <EditorContent editor={editor} />
      </div>

      {/* 图片预览弹窗 - 使用 shadcn-ui Dialog */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-h-[90vh] max-w-[90vw] border-none bg-black/90 p-2" showCloseButton={true}>
          <VisuallyHidden>
            <DialogTitle>图片预览</DialogTitle>
          </VisuallyHidden>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mx-auto max-h-[85vh] max-w-full rounded-lg object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
