import { cn } from "@renderer/lib/utils";
import { MarkTypeButton } from "./components/mark-type-button";
import { TextMarkDialog } from "./dialogs/create/text-mark-dialog";
import { LinkMarkDialog } from "./dialogs/create/link-mark-dialog";
import { ImageMarkDialog } from "./dialogs/create/image-mark-dialog";
import { FileMarkDialog } from "./dialogs/create/file-mark-dialog";
import { ScanMarkDialog } from "./dialogs/create/scan-mark-dialog";

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
      <div className="flex items-center gap-1">
        <MarkTypeButton type="text" tagId={tagId} DialogComponent={TextMarkDialog} />
        <MarkTypeButton type="link" tagId={tagId} DialogComponent={LinkMarkDialog} />
        <MarkTypeButton type="image" tagId={tagId} DialogComponent={ImageMarkDialog} />
        <MarkTypeButton type="file" tagId={tagId} DialogComponent={FileMarkDialog} />
        <MarkTypeButton type="scan" tagId={tagId} DialogComponent={ScanMarkDialog} />
      </div>
    </div>
  );
}
