import { memo, useCallback, useRef } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Clock, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
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
import { NoteThumbnail } from "./note-thumbnail";
import { cn } from "@renderer/lib/utils";

interface DraggableCardProps {
  card: CardData;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onDelete: (id: string) => void;
  onToggleExpansion: (id: string) => void;
}

export const DraggableCard = memo(function DraggableCard({
  card,
  onPositionChange,
  onDelete,
  onToggleExpansion
}: DraggableCardProps) {
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

  const handleToggleExpansion = useCallback(() => {
    if (card.type === "knowledge-base") {
      onToggleExpansion(card.id);
    }
  }, [card.type, card.id, onToggleExpansion]);

  const handleNoteOpen = useCallback((noteId: string) => {
    console.log("打开笔记:", noteId);
    // TODO: 实现笔记打开逻辑
  }, []);

  return (
    <Draggable nodeRef={nodeRef} position={card.position} onDrag={handleDrag} bounds="parent">
      <div
        ref={nodeRef}
        className={cn(
          "absolute",
          card.type === "knowledge-base" && card.data.isExpanded ? "z-50" : "z-10" // 展开的知识库最高层级
        )}
      >
        {card.type === "knowledge-base" ? (
          <KnowledgeBaseCard
            card={card}
            onEdit={handleEdit}
            onOpen={handleOpen}
            onDelete={handleDelete}
            onToggleExpansion={handleToggleExpansion}
            onNoteOpen={handleNoteOpen}
          />
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

interface KnowledgeBaseCardProps extends CardActionsProps {
  card: CardData;
  onToggleExpansion: () => void;
  onNoteOpen: (noteId: string) => void;
}

const KnowledgeBaseCard = memo(function KnowledgeBaseCard({
  card,
  onEdit,
  onOpen,
  onDelete,
  onToggleExpansion,
  onNoteOpen
}: KnowledgeBaseCardProps) {
  const isExpanded = card.data.isExpanded;
  const notes = card.data.notes || [];

  // 计算笔记在圆形布局中的角度和距离
  const getNoteThumbnailProps = (index: number) => {
    const numNotes = notes.length;

    // 右侧垂直排列布局
    const cardWidth = 220; // 知识库卡片宽度
    const spacing = 200; // 笔记之间的垂直间距
    const rightOffset = cardWidth + 40; // 距离知识库卡片右边的距离

    // 计算笔记的位置
    const x = rightOffset;
    const y = (index - (numNotes - 1) / 2) * spacing; // 居中排列

    // 转换为极坐标形式（为了兼容 NoteThumbnail 组件）
    const distance = Math.sqrt(x * x + y * y);
    const angle = Math.atan2(y, x);

    return { angle, distance };
  };
  return (
    <div className="relative">
      {/* 主卡片 */}
      <motion.div
        className={cn(
          "bg-background border-border max-w-[280px] min-w-[220px] rounded-lg border-2 shadow-lg",
          "hover:border-primary/50 transition-all duration-200 hover:shadow-xl",
          "relative cursor-move",
          isExpanded ? "z-20" : "z-10" // 展开时提高 z-index
        )}
        animate={{
          scale: isExpanded ? 1.05 : 1
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {/* 封面图片 - 占据整个卡片 */}
        {card.data.coverImage && (
          <div className="group relative h-48 w-full overflow-hidden rounded-lg">
            <img
              src={card.data.coverImage}
              alt={card.data.title}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />

            {/* 覆盖层 - 显示标题和操作按钮 */}
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <div className="flex h-full flex-col justify-between p-4">
                {/* 顶部操作按钮 */}
                <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 bg-white/20 p-0 backdrop-blur-sm hover:bg-white/30"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4 text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpen();
                        }}
                      >
                        <FileText className="mr-2 h-4 w-4" />
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
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete();
                        }}
                      >
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* 底部信息和展开按钮 */}
                <div className="space-y-2">
                  <div className="text-white">
                    <h3 className="text-lg font-semibold">{card.data.title}</h3>
                    <p className="text-sm text-white/80">{card.data.description}</p>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleExpansion();
                    }}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="mr-2 h-4 w-4 text-white" />
                        <span className="text-white">收起笔记</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-2 h-4 w-4 text-white" />
                        <span className="text-white">查看笔记 ({notes.length})</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* 展开的笔记缩略图 */}
      <AnimatePresence>
        {isExpanded && notes.length > 0 && (
          <div className="pointer-events-none absolute inset-0 z-30">
            {notes.map((note, index) => {
              const { angle, distance } = getNoteThumbnailProps(index);
              return (
                <NoteThumbnail
                  key={note.id}
                  note={note}
                  index={index}
                  onOpen={onNoteOpen}
                  angle={angle}
                  distance={distance}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>
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
