import { useCallback, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSearchStore, useTabStore } from "@renderer/stores";
import { useAdvancedSearch } from "./use-advanced-search";
import { useSearchHotkeys } from "./use-search-hotkeys";
import type { GroupedSearchItems, SearchItem } from "../types";

interface UseSearchCommandStateOptions {
  searchOptions?: Parameters<typeof useAdvancedSearch>[0];
}

export function useSearchCommandState(options: UseSearchCommandStateOptions = {}) {
  const { searchOptions } = options;
  const { isOpen, setIsOpen, closeSearch } = useSearchStore();
  const { openTab, setActiveTab } = useTabStore();
  const navigate = useNavigate();

  const { searchTerm, setSearchTerm, groupedResults, isSearching, isIndexReady } = useAdvancedSearch(
    searchOptions ?? {
      threshold: 0.3,
      debounceDelay: 300,
      maxResults: 50,
      includeMatches: true,
      enableHighlight: true
    }
  );

  useSearchHotkeys({ onOpenSearch: () => setIsOpen(true) });

  const allSearchItems = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = [];
    return items;
  }, []);

  const groupedItems = useMemo<GroupedSearchItems>(() => {
    if (!searchTerm.trim()) {
      return {
        notes: allSearchItems.filter((item) => item.type === "note"),
        pages: allSearchItems.filter((item) => item.type === "page"),
        folders: allSearchItems.filter((item) => item.type === "folder")
      };
    }

    return {
      notes: groupedResults.notes || [],
      pages: groupedResults.pages || [],
      folders: groupedResults.folders || []
    };
  }, [searchTerm, allSearchItems, groupedResults]);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      closeSearch();
      setSearchTerm("");

      if (item.type === "note") {
        openTab(item.id, item.title, "note");
        setActiveTab(item.id);
        navigate({ to: "/notes/$noteId", params: { noteId: item.id } });
        return;
      }

      if (item.type === "folder") {
        navigate({ to: "/" });
        console.log("选中文件夹:", item.title);
        return;
      }

      if (item.path) {
        navigate({ to: item.path });
      }
    },
    [closeSearch, setSearchTerm, navigate, openTab, setActiveTab]
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        setSearchTerm("");
      }
    },
    [setIsOpen, setSearchTerm]
  );

  return {
    isOpen,
    handleOpenChange,
    searchTerm,
    setSearchTerm,
    isIndexReady,
    isSearching,
    groupedItems,
    handleSelect
  };
}
