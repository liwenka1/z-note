import { useThemeStore, type Theme } from "@renderer/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select";
import { Moon, Sun, Monitor } from "lucide-react";

const themeOptions = [
  {
    value: "light" as Theme,
    label: "浅色模式",
    icon: Sun
  },
  {
    value: "dark" as Theme,
    label: "深色模式",
    icon: Moon
  },
  {
    value: "system" as Theme,
    label: "跟随系统",
    icon: Monitor
  }
];

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  const currentThemeOption = themeOptions.find((option) => option.value === theme);

  return (
    <div className="flex items-center space-x-3">
      <label className="text-sm font-medium">主题模式</label>
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="w-40">
          <SelectValue>
            {currentThemeOption && (
              <div className="flex items-center space-x-2">
                <currentThemeOption.icon className="h-4 w-4" />
                <span>{currentThemeOption.label}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {themeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center space-x-2">
                <option.icon className="h-4 w-4" />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
