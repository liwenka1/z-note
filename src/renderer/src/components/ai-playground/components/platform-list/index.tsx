import { useMemo } from "react";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { useAIPlatformsStore } from "@renderer/stores";
import { AI_PLATFORMS } from "../../constants/ai-platforms";
import { PlatformItem } from "./components/platform-item";
import type { AIPlatform } from "../../constants/ai-platforms";

/**
 * 平台列表容器组件
 * 职责：列表渲染和数据管理
 */
interface PlatformListProps {
  onSelect: (platform: AIPlatform) => void;
}

export function PlatformList({ onSelect }: PlatformListProps) {
  const customPlatforms = useAIPlatformsStore((state) => state.customPlatforms);

  // 合并默认平台和自定义平台（保持原有逻辑）
  const allPlatforms = useMemo(() => {
    return [...AI_PLATFORMS, ...customPlatforms];
  }, [customPlatforms]);

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-2 p-4">
          {/* 默认平台 */}
          {AI_PLATFORMS.map((platform) => (
            <PlatformItem key={platform.id} platform={platform} onSelect={onSelect} isCustom={false} />
          ))}

          {/* 自定义平台 */}
          {customPlatforms.length > 0 &&
            customPlatforms.map((platform) => (
              <PlatformItem key={platform.id} platform={platform} onSelect={onSelect} isCustom={true} />
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
