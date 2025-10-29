import { cn } from "@renderer/lib/utils";

// Mark 类型按钮
import { TextMarkButton } from "./mark-type-buttons/text-mark-button";
import { LinkMarkButton } from "./mark-type-buttons/link-mark-button";
import { ImageMarkButton } from "./mark-type-buttons/image-mark-button";
import { FileMarkButton } from "./mark-type-buttons/file-mark-button";
import { ScanMarkButton } from "./mark-type-buttons/scan-mark-button";

interface MarkToolbarProps {
  tagId: number;
  className?: string;
}

export function MarkToolbar({ tagId, className }: MarkToolbarProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-10",
        "bg-background border-b",
        "flex h-12 flex-wrap items-center gap-1 p-1",
        "shadow-sm",
        className
      )}
    >
      {/* Mark 类型按钮组 */}
      <div className="flex items-center gap-1">
        <TextMarkButton tagId={tagId} />
        <LinkMarkButton tagId={tagId} />
        <ImageMarkButton tagId={tagId} />
        <FileMarkButton tagId={tagId} />
        <ScanMarkButton tagId={tagId} />
      </div>
    </div>
  );
}
