import { Moon, Sun } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { useTheme } from "next-themes";
import { themeApi } from "@renderer/api";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // 同步原生主题到主进程
    try {
      await themeApi.setNativeTheme(newTheme);
    } catch (error) {
      console.error("设置原生主题失败:", error);
    }
  };

  const Icon = theme === "light" ? Moon : Sun;
  const tooltip = theme === "light" ? "切换到深色模式" : "切换到浅色模式";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" onClick={toggleTheme} className="h-8 w-8 p-0">
          <Icon className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
