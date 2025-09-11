import { create } from "zustand";

interface SearchState {
  isOpen: boolean;
}

interface SearchActions {
  setIsOpen: (isOpen: boolean) => void;
  openSearch: () => void;
  closeSearch: () => void;
}

type SearchStore = SearchState & SearchActions;

export const useSearchStore = create<SearchStore>((set) => ({
  isOpen: false,

  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  openSearch: () => set({ isOpen: true }),
  closeSearch: () => set({ isOpen: false })
}));
