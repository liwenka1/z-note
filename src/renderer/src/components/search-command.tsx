import { useNavigate } from "@tanstack/react-router";
import { useHotkeys } from "react-hotkeys-hook";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@renderer/components/ui/command";
import { getGroupedSearchData, type SearchItem } from "@renderer/data/search-data";
import { useSearchStore } from "@renderer/store";

export function SearchCommand() {
  const { isOpen, setIsOpen, closeSearch } = useSearchStore();
  const navigate = useNavigate();

  useHotkeys("ctrl+k,cmd+k", (e) => {
    e.preventDefault();
    setIsOpen(true);
  });

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
        <CommandEmpty className="text-muted-foreground py-6 text-center text-sm">没有找到结果</CommandEmpty>

        {groupedItems.notes.length > 0 && (
          <CommandGroup heading="📄 笔记">
            {groupedItems.notes.map((item) => (
              <CommandItem
                key={item.id}
                value={`${item.title} ${item.description || ""}`}
                onSelect={() => handleSelect(item)}
                className="flex cursor-pointer items-start gap-3 px-4 py-3"
              >
                <span className="mt-0.5 text-lg">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{item.title}</div>
                  {item.description && (
                    <div className="text-muted-foreground mt-1 line-clamp-1 text-sm">{item.description}</div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {groupedItems.pages.length > 0 && (
          <CommandGroup heading="📋 页面">
            {groupedItems.pages.map((item) => (
              <CommandItem
                key={item.id}
                value={`${item.title} ${item.description || ""}`}
                onSelect={() => handleSelect(item)}
                className="flex cursor-pointer items-start gap-3 px-4 py-3"
              >
                <span className="mt-0.5 text-lg">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{item.title}</div>
                  {item.description && (
                    <div className="text-muted-foreground mt-1 line-clamp-1 text-sm">{item.description}</div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {groupedItems.folders.length > 0 && (
          <CommandGroup heading="📁 文件夹">
            {groupedItems.folders.map((item) => (
              <CommandItem
                key={item.id}
                value={`${item.title} ${item.description || ""}`}
                onSelect={() => handleSelect(item)}
                className="flex cursor-pointer items-start gap-3 px-4 py-3"
              >
                <span className="mt-0.5 text-lg">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{item.title}</div>
                  {item.description && (
                    <div className="text-muted-foreground mt-1 line-clamp-1 text-sm">{item.description}</div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
