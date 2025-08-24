export interface SearchItem {
  id: string;
  title: string;
  description?: string;
  icon: string;
  path?: string;
}

export interface GroupedSearchItems {
  notes: SearchItem[];
  pages: SearchItem[];
  folders: SearchItem[];
}
