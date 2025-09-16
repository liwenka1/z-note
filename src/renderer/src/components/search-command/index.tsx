import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CommandDialog, CommandInput, CommandList } from "@renderer/components/ui/command";
import { useSearchStore, useTabStore } from "@renderer/stores";
import { useSearchHotkeys } from "./hooks/use-search-hotkeys";
import { useAdvancedSearch } from "./hooks/use-advanced-search";
import { SearchEmpty } from "./components/search-empty";
import { SearchGroup } from "./components/search-group";
import type { SearchItem } from "./types";

export function SearchCommand() {
  const { isOpen, setIsOpen, closeSearch } = useSearchStore();
  const { openTab, setActiveTab } = useTabStore();
  const navigate = useNavigate();

  // 暂时注释掉数据库笔记查询，专注于文件搜索
  // const { data: notes = [] } = useNotes();

  // 使用高性能搜索 Hook - 完全效仿 z-note Tauri 项目
  const { searchTerm, setSearchTerm, groupedResults, isSearching, isIndexReady } = useAdvancedSearch({
    threshold: 0.3, // 效仿 Tauri 项目的阈值
    debounceDelay: 300,
    maxResults: 50,
    includeMatches: true,
    enableHighlight: true
  });

  useSearchHotkeys({ onOpenSearch: () => setIsOpen(true) });

  // 兼容原有数据库笔记（如果存在）
  const allSearchItems = useMemo(() => {
    const items: SearchItem[] = [];
    // 暂时注释掉数据库笔记，专注于文件搜索
    // const notes: any[] = [];
    // notes
    //   .filter((note) => !note.isDeleted)
    //   .forEach((note) => {
    //     items.push({
    //       id: note.id,
    //       title: note.title,
    //       type: "note",
    //       icon: "📝",
    //       description: note.content.slice(0, 100) + (note.content.length > 100 ? "..." : "")
    //     });
    //   });

    return items;
  }, []);

  // 合并文件搜索结果和数据库搜索结果
  const groupedItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return {
        notes: allSearchItems.filter((item) => item.type === "note"),
        pages: allSearchItems.filter((item) => item.type === "page"),
        folders: allSearchItems.filter((item) => item.type === "folder")
      };
    }

    return {
      notes: groupedResults.notes || [],
      pages: groupedResults.pages || [],
      folders: groupedResults.folders || []
    };
  }, [searchTerm, allSearchItems, groupedResults]);

  const handleSelect = (item: SearchItem) => {
    closeSearch();
    setSearchTerm(""); // 清空搜索词

    if (item.path) {
      // 静态页面
      navigate({ to: item.path });
    } else if (item.type === "note") {
      // 打开笔记
      openTab(item.id, item.title, "note");
      setActiveTab(item.id);
      navigate({ to: "/notes/$noteId", params: { noteId: item.id } });
    } else if (item.type === "folder") {
      // 打开文件夹（导航到主页）
      navigate({ to: "/" });
      console.log("选中文件夹:", item.title);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearchTerm(""); // 关闭时清空搜索词
    }
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={handleOpenChange}>
      <CommandInput
        placeholder={isIndexReady ? "搜索笔记、页面、文件夹..." : "正在构建搜索索引..."}
        className="h-14 text-base"
        value={searchTerm}
        onValueChange={setSearchTerm}
        disabled={!isIndexReady}
      />
      <CommandList className="max-h-[400px]">
        {isSearching ? (
          <div className="text-muted-foreground py-6 text-center text-sm">搜索中...</div>
        ) : (
          <>
            <SearchEmpty />

            {groupedItems.notes.length > 0 && (
              <SearchGroup heading="📄 笔记" items={groupedItems.notes} onSelect={handleSelect} />
            )}

            {groupedItems.pages.length > 0 && (
              <SearchGroup heading="📄 页面" items={groupedItems.pages} onSelect={handleSelect} />
            )}

            {groupedItems.folders.length > 0 && (
              <SearchGroup heading="📁 文件夹" items={groupedItems.folders} onSelect={handleSelect} />
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
