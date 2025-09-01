export interface SearchItem {
  id: string;
  title: string;
  type: "note" | "page" | "folder";
  description?: string;
  icon: string;
  path?: string;
}

export interface GroupedSearchItems {
  notes: SearchItem[];
  pages: SearchItem[];
  folders: SearchItem[];
}
