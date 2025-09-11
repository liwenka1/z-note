import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select";
import { useChatStore } from "@renderer/stores/chat-store";
import { format } from "date-fns";

export function SessionSelector() {
  const { sessions, currentSessionId, setCurrentSession, createSession } = useChatStore();
  const currentSession = sessions.find((s) => s.id === currentSessionId);

  // 如果没有会话，创建一个默认会话
  if (sessions.length === 0) {
    return <div className="text-muted-foreground text-xs">暂无会话</div>;
  }

  const handleValueChange = (value: string) => {
    if (value === "new") {
      createSession();
    } else {
      setCurrentSession(value);
    }
  };

  return (
    <Select value={currentSessionId || ""} onValueChange={handleValueChange}>
      <SelectTrigger className="h-7 border-none bg-transparent text-xs shadow-none focus:ring-0">
        <SelectValue placeholder="选择会话">
          {currentSession ? <span className="max-w-32 truncate">{currentSession.title}</span> : "选择会话"}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className="max-w-64">
        {sessions.map((session) => (
          <SelectItem key={session.id} value={session.id}>
            <div className="flex flex-col items-start gap-1">
              <span className="truncate text-sm font-medium">{session.title}</span>
              <span className="text-muted-foreground text-xs">{format(session.updatedAt, "MM/dd HH:mm")}</span>
            </div>
          </SelectItem>
        ))}

        <SelectItem value="new" className="border-border/50 mt-1 border-t pt-2">
          <span className="text-primary text-sm">+ 新建会话</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
