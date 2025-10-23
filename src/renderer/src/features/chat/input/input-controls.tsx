import { Send, Square } from "lucide-react";
import { Button } from "@renderer/components/ui/button";

interface InputControlsProps {
  canSend: boolean;
  isAILoading: boolean;
  onSend: () => void;
  onStop: () => void;
}

export function InputControls({ canSend, isAILoading, onSend, onStop }: InputControlsProps) {
  return (
    <div className="flex items-center gap-2">
      {isAILoading ? (
        <Button onClick={onStop} size="sm" className="h-8 w-8 p-0" variant="destructive">
          <Square className="h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={onSend} disabled={!canSend} size="sm" className="h-8 w-8 p-0">
          <Send className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
