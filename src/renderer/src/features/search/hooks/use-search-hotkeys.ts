import { useHotkeys } from "react-hotkeys-hook";

interface UseSearchHotkeysProps {
  onOpenSearch: () => void;
}

export function useSearchHotkeys({ onOpenSearch }: UseSearchHotkeysProps) {
  useHotkeys("ctrl+k,cmd+k", (e) => {
    e.preventDefault();
    onOpenSearch();
  });
}
