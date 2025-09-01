import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CommandDialog, CommandInput, CommandList } from "@renderer/components/ui/command";
import { useSearchStore, useTabStore } from "@renderer/store";
import { useFilesUIStore } from "@renderer/store/ui";
import { useNotes } from "@renderer/hooks";
import { useSearchHotkeys } from "./hooks/use-search-hotkeys";
import { SearchEmpty } from "./components/search-empty";
import { SearchGroup } from "./components/search-group";
import type { SearchItem } from "./types";

export function SearchCommand() {
  const { isOpen, setIsOpen, closeSearch } = useSearchStore();
  const { addTab, setActiveTab } = useTabStore();
  const { setSelectedFolder } = useFilesUIStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // 获取实际数据
  const { data: notes = [] } = useNotes();

  useSearchHotkeys({ onOpenSearch: () => setIsOpen(true) });

  // 构建搜索数据
  const allSearchItems = useMemo(() => {
    const items: SearchItem[] = [];

    // 添加笔记
    notes
      .filter((note) => !note.isDeleted)
      .forEach((note) => {
        items.push({
          id: note.id,
          title: note.title,
          type: "note",
          icon: "📝",
          description: note.content.slice(0, 100) + (note.content.length > 100 ? "..." : "")
        });
      });

    return items;
  }, [notes]);

  // 过滤搜索结果
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return allSearchItems;

    const term = searchTerm.toLowerCase();
    return allSearchItems.filter(
      (item) => item.title.toLowerCase().includes(term) || item.description?.toLowerCase().includes(term)
    );
  }, [allSearchItems, searchTerm]);

  // 按类型分组
  const groupedItems = useMemo(
    () => ({
      notes: filteredItems.filter((item) => item.type === "note"),
      pages: filteredItems.filter((item) => item.type === "page"),
      folders: filteredItems.filter((item) => item.type === "folder")
    }),
    [filteredItems]
  );

  const handleSelect = (item: SearchItem) => {
    closeSearch();
    setSearchTerm(""); // 清空搜索词

    if (item.path) {
      // 静态页面
      navigate({ to: item.path });
    } else if (item.type === "note") {
      // 打开笔记
      addTab({ id: item.id, title: item.title, type: "note" });
      setActiveTab(item.id);
      navigate({ to: "/notes/$noteId", params: { noteId: item.id } });
    } else if (item.type === "folder") {
      // 打开文件夹（导航到主页并选中文件夹）
      setSelectedFolder(item.id);
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
        placeholder="搜索笔记、页面、文件夹..."
        className="h-14 text-base"
        value={searchTerm}
        onValueChange={setSearchTerm}
      />
      <CommandList className="max-h-[400px]">
        <SearchEmpty />

        {groupedItems.notes.length > 0 && (
          <SearchGroup heading="📄 笔记" items={groupedItems.notes} onSelect={handleSelect} />
        )}
      </CommandList>
    </CommandDialog>
  );
}
