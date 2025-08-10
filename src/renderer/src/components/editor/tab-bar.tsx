import { X, Plus, Edit3, Eye, Columns2, MoreHorizontal } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { cn } from "@renderer/lib/utils";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@renderer/components/ui/dropdown-menu";
import { useNotesStore, useTabStore } from "@renderer/store";
import { useEditorStore } from "@renderer/store/editor-store";

const viewModeConfig = [
  {
    mode: "edit" as const,
    icon: Edit3,
    label: "编辑模式",
    tooltip: "仅显示编辑器"
  },
  {
    mode: "split" as const,
    icon: Columns2,
    label: "分屏模式",
    tooltip: "编辑器和预览并排显示"
  },
  {
    mode: "preview" as const,
    icon: Eye,
    label: "预览模式",
    tooltip: "仅显示预览"
  }
];

function ViewModeButtons() {
  const { viewMode, setViewMode } = useEditorStore();

  return (
    <>
      {viewModeConfig.map(({ mode, icon: Icon, label, tooltip }) => (
        <Tooltip key={mode}>
          <TooltipTrigger asChild>
            <Button
              variant={viewMode === mode ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode(mode)}
              className="h-8 w-8 rounded-none p-0"
            >
              <Icon className="h-4 w-4" />
              <span className="sr-only">{label}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </>
  );
}

export function TabBar() {
  const { openTabs, activeTabId, closeTab, closeAllTabs, closeOtherTabs, setActiveTab } = useTabStore();
  const { notes, createNote } = useNotesStore();
  const { isNoteModified, stopEditing } = useEditorStore();
  const navigate = useNavigate();
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // 检查是否可以滚动
  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
      setScrollLeft(scrollLeft);
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, [openTabs]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 120;
      const newScrollLeft = direction === "left" ? Math.max(0, scrollLeft - scrollAmount) : scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    navigate({ to: "/notes/$noteId", params: { noteId: tabId } });
  };

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();

    // 关闭标签时清除编辑状态
    stopEditing(tabId);
    closeTab(tabId);

    // 如果关闭的是当前活跃标签，需要切换到其他标签或首页
    if (tabId === activeTabId) {
      const remainingTabs = openTabs.filter((tab) => tab.id !== tabId);
      if (remainingTabs.length > 0) {
        const nextTab = remainingTabs[remainingTabs.length - 1];
        setActiveTab(nextTab.id);
        navigate({ to: "/notes/$noteId", params: { noteId: nextTab.id } });
      } else {
        navigate({ to: "/" });
      }
    }
  };

  const handleNewNote = () => {
    const newNoteId = createNote({
      title: `新笔记 ${new Date().toLocaleString()}`,
      content: "",
      tags: [],
      isFavorite: false,
      isDeleted: false
    });
    navigate({ to: "/notes/$noteId", params: { noteId: newNoteId } });
  };

  if (openTabs.length === 0) {
    return null;
  }

  return (
    <div className="bg-background border-border flex h-9 items-center border-b">
      {/* 左滚动按钮 */}
      {canScrollLeft && (
        <Button variant="ghost" size="sm" className="h-8 w-6 rounded-none p-0" onClick={() => handleScroll("left")}>
          <span className="text-xs">‹</span>
        </Button>
      )}

      {/* 标签容器 */}
      <div
        ref={scrollContainerRef}
        className="scrollbar-none flex-1 overflow-x-auto"
        onScroll={checkScrollability}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex h-full">
          {openTabs.map((tab) => {
            const note = notes.find((n) => n.id === tab.id);
            const isActive = tab.id === activeTabId;

            return (
              <div
                key={tab.id}
                className={cn(
                  "border-border hover:bg-secondary/50 group flex h-full max-w-[200px] min-w-[120px] cursor-pointer items-center border-r px-3 transition-colors",
                  isActive && "bg-background relative border-b-transparent"
                )}
                onClick={() => handleTabClick(tab.id)}
              >
                {/* 活跃标签的底部指示器 */}
                {isActive && <div className="bg-primary absolute bottom-0 left-0 h-0.5 w-full"></div>}

                {/* 标签内容 */}
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="truncate text-sm">{note?.title || "未知笔记"}</span>
                  {isNoteModified(tab.id) && <div className="bg-muted-foreground h-1 w-1 rounded-full"></div>}
                </div>

                {/* 关闭按钮 */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:bg-secondary hover:text-foreground ml-1 h-4 w-4 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => handleTabClose(e, tab.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 右滚动按钮 */}
      {canScrollRight && (
        <Button variant="ghost" size="sm" className="h-8 w-6 rounded-none p-0" onClick={() => handleScroll("right")}>
          <span className="text-xs">›</span>
        </Button>
      )}

      {/* 右侧操作按钮 */}
      <div className="border-border flex border-l">
        {/* 新建笔记 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-none p-0" onClick={handleNewNote}>
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>新建笔记 (Ctrl+N)</p>
          </TooltipContent>
        </Tooltip>

        {/* 视图模式切换 */}
        <ViewModeButtons />

        {/* 更多操作 */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-none p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>更多操作</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                // 关闭所有标签时清除所有编辑状态
                openTabs.forEach((tab) => stopEditing(tab.id));
                closeAllTabs();
              }}
            >
              关闭所有标签
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (activeTabId) {
                  // 关闭其他标签时清除其他标签的编辑状态
                  openTabs.forEach((tab) => {
                    if (tab.id !== activeTabId) {
                      stopEditing(tab.id);
                    }
                  });
                  closeOtherTabs(activeTabId);
                }
              }}
              disabled={!activeTabId}
            >
              关闭其他标签
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>保存所有标签</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
