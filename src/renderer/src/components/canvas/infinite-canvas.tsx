import { useRef, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@renderer/components/ui/dropdown-menu";
import { DraggableCard } from "./draggable-card";

export interface CardData {
  id: string;
  type: "knowledge-base" | "note";
  position: { x: number; y: number };
  data: {
    title: string;
    description?: string;
    content?: string;
    noteCount?: number;
    lastModified?: Date;
  };
}

// 初始化示例数据
const initialCards: CardData[] = [
  {
    id: "1",
    type: "knowledge-base",
    position: { x: 300, y: 200 },
    data: {
      title: "我的第一个知识库",
      description: "开始你的知识管理之旅",
      noteCount: 5
    }
  },
  {
    id: "2",
    type: "note",
    position: { x: 600, y: 300 },
    data: {
      title: "快速笔记",
      content: "这是一个示例笔记，你可以在这里记录任何想法...",
      lastModified: new Date()
    }
  },
  {
    id: "3",
    type: "knowledge-base",
    position: { x: 100, y: 400 },
    data: {
      title: "学习资料",
      description: "收集各种学习资源和笔记",
      noteCount: 12
    }
  }
];

export function InfiniteCanvas() {
  const [cards, setCards] = useState<CardData[]>(initialCards);
  const [isCreating, setIsCreating] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // 更新卡片位置
  const updateCardPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setCards((prevCards) => prevCards.map((card) => (card.id === id ? { ...card, position } : card)));
  }, []);

  // 删除卡片
  const deleteCard = useCallback((id: string) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  }, []);

  // 创建新卡片
  const createCard = useCallback((type: "knowledge-base" | "note", position: { x: number; y: number }) => {
    const newCard: CardData = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: {
        title: type === "knowledge-base" ? "新知识库" : "新笔记",
        description: type === "knowledge-base" ? "点击编辑描述" : undefined,
        content: type === "note" ? "" : undefined,
        noteCount: type === "knowledge-base" ? 0 : undefined,
        lastModified: type === "note" ? new Date() : undefined
      }
    };
    setCards((prevCards) => [...prevCards, newCard]);
    setIsCreating(false);
  }, []);

  // 处理画布点击创建
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent) => {
      if (isCreating && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const scrollLeft = canvasRef.current.scrollLeft;
        const scrollTop = canvasRef.current.scrollTop;

        const position = {
          x: event.clientX - rect.left + scrollLeft - 120, // 减去卡片宽度的一半
          y: event.clientY - rect.top + scrollTop - 80 // 减去卡片高度的一半
        };

        // 默认创建笔记，可以改为弹出选择菜单
        createCard("note", position);
      }
    },
    [isCreating, createCard]
  );

  return (
    <div className="bg-background relative h-full w-full">
      {/* 顶部工具栏 */}
      <div className="bg-background/80 border-border absolute top-4 left-4 z-10 flex items-center gap-2 rounded-lg border p-2 shadow-lg backdrop-blur-sm">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              新建
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => createCard("knowledge-base", { x: 400, y: 300 })}>
              <div className="flex flex-col">
                <span className="font-medium">知识库</span>
                <span className="text-muted-foreground text-xs">组织和管理相关笔记</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => createCard("note", { x: 500, y: 400 })}>
              <div className="flex flex-col">
                <span className="font-medium">快速笔记</span>
                <span className="text-muted-foreground text-xs">创建一个独立的笔记</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant={isCreating ? "default" : "outline"}
          size="sm"
          onClick={() => setIsCreating(!isCreating)}
          className={isCreating ? "bg-primary" : ""}
        >
          {isCreating ? "点击画布创建" : "画布创建模式"}
        </Button>
      </div>

      {/* 无限滚动画布 */}
      <div
        ref={canvasRef}
        className="bg-background h-full w-full cursor-pointer overflow-auto"
        onClick={handleCanvasClick}
      >
        {/* 超大容器支持无限滚动 */}
        <div
          className="relative"
          style={{
            width: "8000px", // 超大宽度
            height: "6000px", // 超大高度
            minWidth: "100%",
            minHeight: "100%"
          }}
        >
          {/* 渲染所有卡片 */}
          {cards.map((card) => (
            <DraggableCard key={card.id} card={card} onPositionChange={updateCardPosition} onDelete={deleteCard} />
          ))}

          {/* 空状态提示 */}
          {cards.length === 0 && (
            <div className="bg-background/80 border-border absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-lg border p-8 text-center backdrop-blur-sm">
              <h2 className="mb-2 text-xl font-semibold">欢迎来到你的知识画布</h2>
              <p className="text-muted-foreground mb-4">点击左上角的按钮开始创建你的第一个知识库或笔记</p>
              <p className="text-muted-foreground text-sm">或者开启画布创建模式，直接点击画布任意位置创建笔记</p>
            </div>
          )}
        </div>
      </div>

      {/* 滚动提示 */}
      <div className="text-muted-foreground bg-background/80 border-border absolute right-4 bottom-4 rounded border px-2 py-1 text-xs backdrop-blur-sm">
        可无限滚动的画布空间
      </div>
    </div>
  );
}
