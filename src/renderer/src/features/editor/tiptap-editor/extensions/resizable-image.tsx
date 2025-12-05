import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useCallback, useRef, useState } from "react";
import { cn } from "@renderer/lib/utils";
import { AlignLeft, AlignCenter, AlignRight, ArrowDownRight } from "lucide-react";

// 图片对齐方式
type ImageAlignment = "left" | "center" | "right";

// 图片属性类型
interface ImageAttrs {
  src: string;
  alt?: string;
  title?: string;
  width?: string | number;
  alignment?: ImageAlignment;
}

/**
 * 可调整大小的图片节点视图
 */
function ResizableImageView({ node, updateAttributes, selected }: NodeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { src, alt, title, width, alignment = "left" } = node.attrs as ImageAttrs;

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

  // 对齐选项
  const alignmentOptions: { value: ImageAlignment; icon: typeof AlignLeft; label: string }[] = [
    { value: "left", icon: AlignLeft, label: "居左" },
    { value: "center", icon: AlignCenter, label: "居中" },
    { value: "right", icon: AlignRight, label: "居右" }
  ];

  // 是否显示调整大小按钮
  const showResizeHandle = isHovered || isResizing;

  return (
    <NodeViewWrapper
      className={cn(
        "relative my-2 flex",
        alignment === "left" && "justify-start",
        alignment === "center" && "justify-center",
        alignment === "right" && "justify-end"
      )}
    >
      <div
        ref={containerRef}
        className={cn(
          "group relative inline-block max-w-full",
          selected && "ring-1 ring-blue-500",
          isResizing && "select-none"
        )}
        style={width ? { width } : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => !isResizing && setIsHovered(false)}
      >
        <img
          src={src}
          alt={alt || ""}
          title={title || ""}
          className="h-auto max-w-full object-contain"
          draggable={false}
        />

        {/* Hover 时显示控制按钮 */}
        {showResizeHandle && (
          <>
            {/* 右下角调整大小按钮 */}
            <div
              className="bg-popover/90 absolute right-1 bottom-1 flex cursor-se-resize items-center justify-center rounded border p-0.5 shadow-sm backdrop-blur-sm"
              onMouseDown={(e) => handleResizeStart(e, "bottom-right")}
              title="拖拽调整大小"
            >
              <ArrowDownRight className="h-3 w-3" />
            </div>

            {/* 顶部对齐按钮 */}
            <div className="bg-popover/90 absolute top-1 left-1/2 flex -translate-x-1/2 gap-0.5 rounded border p-0.5 shadow-sm backdrop-blur-sm">
              {alignmentOptions.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  type="button"
                  title={label}
                  className={cn(
                    "rounded p-1 transition-colors",
                    alignment === value ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                  onClick={() => updateAttributes({ alignment: value })}
                >
                  <Icon className="h-3 w-3" />
                </button>
              ))}
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
      },
      alignment: {
        default: "left",
        parseHTML: (element) => element.getAttribute("data-alignment") || "left",
        renderHTML: (attributes) => {
          return {
            "data-alignment": attributes.alignment
          };
        }
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
