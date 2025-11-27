import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { useCallback, useRef, useState } from "react";
import { cn } from "@renderer/lib/utils";

/**
 * 可调整大小的图片节点视图
 */
function ResizableImageView({
  node,
  updateAttributes,
  selected
}: {
  node: { attrs: { src: string; alt?: string; title?: string; width?: string | number } };
  updateAttributes: (attrs: Record<string, unknown>) => void;
  selected: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  const { src, alt, title, width } = node.attrs;

  // 开始调整大小
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, corner: string) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);

      const startX = e.clientX;
      const startWidth = containerRef.current?.offsetWidth || 300;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = corner.includes("right") ? moveEvent.clientX - startX : startX - moveEvent.clientX;

        const newWidth = Math.max(100, startWidth + deltaX);
        updateAttributes({ width: newWidth });
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [updateAttributes]
  );

  // 预设尺寸按钮（使用百分比字符串）
  const presetWidths = [
    { label: "25%", value: "25%" },
    { label: "50%", value: "50%" },
    { label: "75%", value: "75%" },
    { label: "100%", value: "100%" }
  ];

  // 获取当前显示的宽度值
  const displayWidth = typeof width === "number" ? `${width}px` : width || "100%";

  return (
    <NodeViewWrapper className="relative">
      <div
        ref={containerRef}
        className={cn(
          "relative inline-block",
          selected && "ring-primary ring-2 ring-offset-2",
          isResizing && "select-none"
        )}
        style={{ width: width || "100%", maxWidth: "100%" }}
      >
        <img
          src={src}
          alt={alt || ""}
          title={title || ""}
          className="h-auto w-full rounded-lg object-contain"
          draggable={false}
        />

        {/* 选中时显示调整控件 */}
        {selected && (
          <>
            {/* 右下角拖拽句柄 */}
            <div
              className="border-primary bg-background hover:bg-primary hover:border-primary-foreground absolute -right-2 -bottom-2 h-4 w-4 cursor-se-resize rounded-full border-2 shadow-md"
              onMouseDown={(e) => handleResizeStart(e, "bottom-right")}
            />

            {/* 右侧拖拽句柄 */}
            <div
              className="border-primary bg-background hover:bg-primary absolute top-1/2 -right-2 h-8 w-2 -translate-y-1/2 cursor-e-resize rounded-full border-2 shadow-md"
              onMouseDown={(e) => handleResizeStart(e, "right")}
            />

            {/* 预设尺寸按钮 */}
            <div className="bg-popover absolute -top-10 left-0 flex gap-1 rounded-lg border p-1 shadow-lg">
              {presetWidths.map(({ label, value }) => (
                <button
                  key={label}
                  type="button"
                  className={cn(
                    "rounded px-2 py-1 text-xs font-medium transition-colors",
                    width === value ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                  onClick={() => updateAttributes({ width: value })}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 当前宽度显示 */}
            <div className="bg-popover absolute -bottom-8 left-1/2 -translate-x-1/2 rounded border px-2 py-1 text-xs shadow-lg">
              {displayWidth}
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}

/**
 * 可调整大小的图片扩展
 */
export const ResizableImage = Node.create({
  name: "image",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null
      },
      alt: {
        default: null
      },
      title: {
        default: null
      },
      width: {
        default: null
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[src]"
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options
          });
        }
    };
  }
});
