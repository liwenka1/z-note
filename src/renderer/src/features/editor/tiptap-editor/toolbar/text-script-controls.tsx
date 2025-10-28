import { Editor } from "@tiptap/react";
import { Superscript, Subscript } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { cn } from "@renderer/lib/utils";
import { useEditorActiveState } from "../../hooks/use-editor-active-state";

interface TextScriptControlsProps {
  editor: Editor | null;
}

export function TextScriptControls({ editor }: TextScriptControlsProps) {
  const editorState = useEditorActiveState(editor);

  if (!editor) {
    return null;
  }

  const toggleSuperscript = () => editor.chain().focus().toggleSuperscript().run();
  const toggleSubscript = () => editor.chain().focus().toggleSubscript().run();

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSuperscript}
            className={cn("h-8 w-8 p-0", editorState.isSuperscript && "bg-secondary")}
          >
            <Superscript className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>上标 (Ctrl+.)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSubscript}
            className={cn("h-8 w-8 p-0", editorState.isSubscript && "bg-secondary")}
          >
            <Subscript className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>下标 (Ctrl+,)</TooltipContent>
      </Tooltip>
    </div>
  );
}
