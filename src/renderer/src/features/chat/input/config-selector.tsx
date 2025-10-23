import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select";
import { type AIConfig } from "@renderer/stores";

interface ConfigSelectorProps {
  configs: AIConfig[];
  selectedConfigId: string;
  selectedConfig: AIConfig | null;
  onConfigChange: (configId: string) => void;
  disabled: boolean;
}

export function ConfigSelector({
  configs,
  selectedConfigId,
  selectedConfig,
  onConfigChange,
  disabled
}: ConfigSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Select value={selectedConfigId} onValueChange={onConfigChange} disabled={disabled}>
        <SelectTrigger className="h-7 border-none bg-transparent text-xs shadow-none focus:ring-0">
          <SelectValue>{selectedConfig ? selectedConfig.name : "选择配置"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {configs.map((config) => (
            <SelectItem key={config.id} value={config.id}>
              {config.name} ({config.model})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
