import { useNavigate } from "@tanstack/react-router";
import { CommandDialog, CommandInput, CommandList } from "@renderer/components/ui/command";
import { getGroupedSearchData } from "@renderer/data/search-data";
import { useSearchStore } from "@renderer/store";
import { useSearchHotkeys } from "./hooks/use-search-hotkeys";
import { SearchEmpty } from "./components/search-empty";
import { SearchGroup } from "./components/search-group";
import type { SearchItem } from "./types";

export function SearchCommand() {
  const { isOpen, setIsOpen, closeSearch } = useSearchStore();
  const navigate = useNavigate();

  useSearchHotkeys({ onOpenSearch: () => setIsOpen(true) });

  const handleSelect = (item: SearchItem) => {
    closeSearch();
    if (item.path) {
      navigate({ to: item.path });
    } else {
      // TODO: 处理笔记和文件夹的打开逻辑
      console.log("打开:", item.title);
    }
  };

  const groupedItems = getGroupedSearchData();

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput placeholder="搜索笔记、页面、文件夹..." className="h-14 text-base" />
      <CommandList className="max-h-[400px]">
        <SearchEmpty />

        <SearchGroup heading="📄 笔记" items={groupedItems.notes} onSelect={handleSelect} />

        <SearchGroup heading="📋 页面" items={groupedItems.pages} onSelect={handleSelect} />

        <SearchGroup heading="📁 文件夹" items={groupedItems.folders} onSelect={handleSelect} />
      </CommandList>
    </CommandDialog>
  );
}
