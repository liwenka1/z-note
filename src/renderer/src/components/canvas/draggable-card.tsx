import { memo, useCallback, useRef } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Database, FileText, Clock, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Button } from "@renderer/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@renderer/components/ui/dropdown-menu";
import { CardData } from "./infinite-canvas";
import { cn } from "@renderer/lib/utils";

interface DraggableCardProps {
  card: CardData;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onDelete: (id: string) => void;
}

export const DraggableCard = memo(function DraggableCard({ card, onPositionChange, onDelete }: DraggableCardProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleDrag = useCallback(
    (_e: DraggableEvent, data: DraggableData) => {
      onPositionChange(card.id, { x: data.x, y: data.y });
    },
    [card.id, onPositionChange]
  );

  const handleEdit = useCallback(() => {
    console.log("编辑:", card.data.title);
    // TODO: 打开编辑对话框或跳转到编辑页面
  }, [card.data.title]);

  const handleOpen = useCallback(() => {
    console.log("打开:", card.data.title);
    // TODO: 打开详情页面
  }, [card.data.title]);

  const handleDelete = useCallback(() => {
    onDelete(card.id);
  }, [card.id, onDelete]);

  return (
    <Draggable nodeRef={nodeRef} position={card.position} onDrag={handleDrag} bounds="parent">
      <div ref={nodeRef} className="absolute">
        {card.type === "knowledge-base" ? (
          <KnowledgeBaseCard card={card} onEdit={handleEdit} onOpen={handleOpen} onDelete={handleDelete} />
        ) : (
          <NoteCard card={card} onEdit={handleEdit} onOpen={handleOpen} onDelete={handleDelete} />
        )}
      </div>
    </Draggable>
  );
});

// 知识库卡片组件
interface CardActionsProps {
  onEdit: () => void;
  onOpen: () => void;
  onDelete: () => void;
}

const KnowledgeBaseCard = memo(function KnowledgeBaseCard({
  card,
  onEdit,
  onOpen,
  onDelete
}: { card: CardData } & CardActionsProps) {
  return (
    <div
      className={cn(
        "bg-background border-border max-w-[280px] min-w-[220px] rounded-lg border-2 shadow-lg",
        "hover:border-primary/50 transition-all duration-200 hover:shadow-xl",
        "cursor-move"
      )}
    >
      {/* 标题栏 */}
      <div className="border-border flex cursor-grab items-center justify-between border-b p-3 active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 rounded-md p-1.5">
            <Database className="text-primary h-4 w-4" />
          </div>
          <h3 className="truncate text-sm font-medium">{card.data.title}</h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 cursor-pointer p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
            >
              <FileText className="mr-2 h-3 w-3" />
              打开
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-destructive"
            >
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 内容区域 */}
      <div className="p-3">
        {card.data.description && (
          <p className="text-muted-foreground mb-3 line-clamp-2 text-xs">{card.data.description}</p>
        )}

        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {card.data.noteCount || 0} 个笔记
          </span>
          <span>知识库</span>
        </div>
      </div>
    </div>
  );
});

// 笔记卡片组件
const NoteCard = memo(function NoteCard({ card, onEdit, onOpen, onDelete }: { card: CardData } & CardActionsProps) {
  const previewContent =
    card.data.content && card.data.content.length > 100
      ? `${card.data.content.slice(0, 100)}...`
      : card.data.content || "";

  return (
    <div
      className={cn(
        "bg-background border-border max-w-[260px] min-w-[200px] rounded-lg border-2 shadow-lg",
        "hover:border-primary/50 transition-all duration-200 hover:shadow-xl",
        "cursor-move"
      )}
      onDoubleClick={onOpen}
    >
      {/* 标题栏 */}
      <div className="border-border flex cursor-grab items-center justify-between border-b p-3 active:cursor-grabbing">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <FileText className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          <h3 className="truncate text-sm font-medium">{card.data.title}</h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 flex-shrink-0 cursor-pointer p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
            >
              打开
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-destructive"
            >
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 内容预览 */}
      {previewContent && (
        <div className="border-border border-b p-3">
          <p className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">{previewContent}</p>
        </div>
      )}

      {/* 底部信息 */}
      <div className="p-3">
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3" />
          <span>
            {card.data.lastModified
              ? format(card.data.lastModified, "MM月dd日 HH:mm", {
                  locale: zhCN
                })
              : "刚刚创建"}
          </span>
        </div>
      </div>
    </div>
  );
});
