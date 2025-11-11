export interface SearchItem {
  id: string;
  title: string;
  type: "note" | "page" | "tag";
  description?: string;
  icon: string;
  path?: string;
  // 标签特有属性
  isLocked?: boolean;
  isPin?: boolean;
}

export interface GroupedSearchItems {
  notes: SearchItem[];
  pages: SearchItem[];
  tags: SearchItem[];
}
