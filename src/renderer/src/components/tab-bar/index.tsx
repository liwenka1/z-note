import { X, Plus, MoreHorizontal } from "lucide-react";
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
import { useTabStore } from "@renderer/stores";
import { useEditorStore } from "@renderer/stores/editor-store";
import { useNoteManager } from "@renderer/hooks";

export function TabBar() {
  const { openTabs, activeTabId, closeTab, closeAllTabs, closeOtherTabs, setActiveTab } = useTabStore();
  const { isNoteModified, stopEditing } = useEditorStore();
  const { quickCreateNote } = useNoteManager();
  const navigate = useNavigate();
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // 获取当前激活的 tab 类型
  const activeTab = openTabs.find((tab) => tab.id === activeTabId);
  const isNoteTab = activeTab?.type === "note" || activeTab?.type === undefined; // 兼容旧数据

  // 自动滚动到激活的 tab
  const scrollToActiveTab = () => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const activeTabElement = activeTabRef.current;
      const container = scrollContainerRef.current;

      const tabLeft = activeTabElement.offsetLeft;
      const tabWidth = activeTabElement.offsetWidth;
      const containerScrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;

      // 检查 tab 是否完全可见
      const isTabVisible = tabLeft >= containerScrollLeft && tabLeft + tabWidth <= containerScrollLeft + containerWidth;

      if (!isTabVisible) {
        // 计算需要滚动到的位置，让 tab 居中显示
        const scrollTo = tabLeft - containerWidth / 2 + tabWidth / 2;
        container.scrollTo({ left: Math.max(0, scrollTo), behavior: "smooth" });
      }
    }
  };

  // 当激活的 tab 改变时，自动滚动到该 tab
  useEffect(() => {
    scrollToActiveTab();
  }, [activeTabId]);

  // 监听 activeTabId 变化并导航到对应页面
  useEffect(() => {
    if (activeTabId) {
      const activeTab = openTabs.find((tab) => tab.id === activeTabId);
      if (activeTab) {
        if (activeTab.id === "settings") {
          navigate({ to: "/settings" });
        } else {
          navigate({ to: "/notes/$noteId", params: { noteId: activeTab.id } });
        }
      }
    }
  }, [activeTabId, openTabs, navigate]);

  // 当 tabs 数组改变时，也检查是否需要滚动（新增 tab 的情况）
  useEffect(() => {
    // 延迟一点确保 DOM 已更新
    const timer = setTimeout(() => {
      scrollToActiveTab();
    }, 50);
    return () => clearTimeout(timer);
  }, [openTabs.length]);

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
    if (tabId !== "settings") {
      navigate({ to: "/notes/$noteId", params: { noteId: tabId } });
    }
  };

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    stopEditing(tabId);
    closeTab(tabId);
  };

  const handleNewNote = async () => {
    await quickCreateNote();
  };

  if (openTabs.length === 0) {
    return null;
  }

  return (
    <div className="bg-card flex h-9 shrink-0">
      {/* 左滚动按钮 */}
      {canScrollLeft && (
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-muted/40 text-muted-foreground hover:text-foreground h-full w-6 rounded-none p-0"
          onClick={() => handleScroll("left")}
        >
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
            const isActive = tab.id === activeTabId;

            return (
              <div
                key={tab.id}
                ref={isActive ? activeTabRef : null}
                className={cn(
                  "group relative flex h-full max-w-[200px] min-w-[120px] cursor-pointer items-center px-3",
                  "border-border/30 border-r",
                  isActive
                    ? "bg-background text-foreground border-t-2 border-t-transparent"
                    : "bg-card hover:bg-muted/30 text-muted-foreground border-t-border/20 border-t"
                )}
                onClick={() => handleTabClick(tab.id)}
              >
                {/* VSCode 风格的顶部指示条 */}
                {isActive && <div className="bg-primary absolute top-0 right-0 left-0 h-[2px]"></div>}

                {/* 标签内容 */}
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="truncate text-sm font-medium">{tab.title}</span>
                  {tab.type === "note" && isNoteModified(tab.id) && (
                    <div className="bg-primary h-1.5 w-1.5 rounded-full"></div>
                  )}
                </div>

                {/* 关闭按钮 */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "ml-1 h-4 w-4 p-0",
                    "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                    "opacity-0 group-hover:opacity-100",
                    isActive && "opacity-60 hover:opacity-100"
                  )}
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
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-muted/40 text-muted-foreground hover:text-foreground h-full w-6 rounded-none p-0"
          onClick={() => handleScroll("right")}
        >
          <span className="text-xs">›</span>
        </Button>
      )}

      {/* 右侧操作按钮 */}
      <div className="border-border/30 bg-card flex border-l">
        {/* 新建笔记 - 只在笔记 tab 时显示 */}
        {isNoteTab && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-muted/40 text-muted-foreground hover:text-foreground h-full w-8 rounded-none p-0"
                onClick={handleNewNote}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>新建笔记 (Ctrl+N)</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* 更多操作 - 只在笔记 tab 时显示 */}
        {isNoteTab && (
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-muted/40 text-muted-foreground hover:text-foreground h-full w-8 rounded-none p-0"
                  >
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
                  // 导航到首页
                  navigate({ to: "/" });
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
        )}
      </div>
    </div>
  );
}
