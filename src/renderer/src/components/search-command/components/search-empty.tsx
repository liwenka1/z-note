import { CommandEmpty } from "@renderer/components/ui/command";

export function SearchEmpty() {
  return <CommandEmpty className="text-muted-foreground py-6 text-center text-sm">没有找到结果</CommandEmpty>;
}
