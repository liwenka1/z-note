import { CommandGroup } from "@renderer/components/ui/command";
import { SearchResultItem } from "./search-result-item";
import type { SearchItem } from "../types";

interface SearchGroupProps {
  heading: string;
  items: SearchItem[];
  onSelect: (item: SearchItem) => void;
}

export function SearchGroup({ heading, items, onSelect }: SearchGroupProps) {
  if (items.length === 0) return null;

  return (
    <CommandGroup heading={heading}>
      {items.map((item) => (
        <SearchResultItem key={item.id} item={item} onSelect={onSelect} />
      ))}
    </CommandGroup>
  );
}
