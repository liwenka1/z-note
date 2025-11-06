import { CommandList } from "@renderer/components/ui/command";
import type { GroupedSearchItems, SearchItem } from "../types";
import { SearchEmpty } from "./search-empty";
import { SearchGroup } from "./search-group";

interface SearchResultsProps {
  groupedItems: GroupedSearchItems;
  isSearching: boolean;
  isIndexReady: boolean;
  onSelect: (item: SearchItem) => void;
}

export function SearchResults({ groupedItems, isSearching, isIndexReady, onSelect }: SearchResultsProps) {
  if (!isIndexReady) {
    return (
      <CommandList className="max-h-[400px]">
        <div className="text-muted-foreground py-6 text-center text-sm">正在构建搜索索引...</div>
      </CommandList>
    );
  }

  return (
    <CommandList className="max-h-[400px]">
      {isSearching ? (
        <div className="text-muted-foreground py-6 text-center text-sm">搜索中...</div>
      ) : (
        <>
          <SearchEmpty />
          {groupedItems.tags.length > 0 && (
            <SearchGroup heading="🏷️ 标签" items={groupedItems.tags} onSelect={onSelect} />
          )}
          {groupedItems.notes.length > 0 && (
            <SearchGroup heading="📄 笔记" items={groupedItems.notes} onSelect={onSelect} />
          )}
          {groupedItems.pages.length > 0 && (
            <SearchGroup heading="📄 页面" items={groupedItems.pages} onSelect={onSelect} />
          )}
          {groupedItems.folders.length > 0 && (
            <SearchGroup heading="📁 文件夹" items={groupedItems.folders} onSelect={onSelect} />
          )}
        </>
      )}
    </CommandList>
  );
}
