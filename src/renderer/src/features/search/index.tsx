import { CommandDialog, CommandInput } from "@renderer/components/ui/command";
import { useSearchCommandState } from "./hooks/use-search-command-state";
import { SearchResults } from "./results";

export function SearchCommand() {
  const { isOpen, handleOpenChange, searchTerm, setSearchTerm, isIndexReady, isSearching, groupedItems, handleSelect } =
    useSearchCommandState();

  return (
    <CommandDialog open={isOpen} onOpenChange={handleOpenChange}>
      <CommandInput
        placeholder={isIndexReady ? "搜索笔记、页面、文件夹..." : "正在构建搜索索引..."}
        className="h-14 text-base"
        value={searchTerm}
        onValueChange={setSearchTerm}
        disabled={!isIndexReady}
      />
      <SearchResults
        groupedItems={groupedItems}
        isSearching={isSearching}
        isIndexReady={isIndexReady}
        onSelect={handleSelect}
      />
    </CommandDialog>
  );
}
