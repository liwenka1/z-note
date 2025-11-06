import { CommandItem } from "@renderer/components/ui/command";
import type { SearchItem } from "../types";

interface SearchResultItemProps {
  item: SearchItem;
  onSelect: (item: SearchItem) => void;
}

export function SearchResultItem({ item, onSelect }: SearchResultItemProps) {
  // 为标签类型添加徽章展示
  const renderBadges = () => {
    if (item.type === "tag") {
      return (
        <div className="mt-1 flex gap-1">
          {item.isPin && (
            <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
              📌 置顶
            </span>
          )}
          {item.isLocked && (
            <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
              🔒 锁定
            </span>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <CommandItem
      key={item.id}
      value={`${item.title} ${item.description || ""}`}
      onSelect={() => onSelect(item)}
      className="flex cursor-pointer items-start gap-3 px-4 py-3"
    >
      <span className="mt-0.5 text-lg">{item.icon}</span>
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{item.title}</div>
        {item.description && <div className="text-muted-foreground mt-1 line-clamp-1 text-sm">{item.description}</div>}
        {renderBadges()}
      </div>
    </CommandItem>
  );
}
