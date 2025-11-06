export interface SearchItem {
  id: string;
  title: string;
  type: "note" | "page" | "folder" | "tag";
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
  folders: SearchItem[];
  tags: SearchItem[];
}
