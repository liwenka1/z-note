import { useAIPlatformsStore } from "@renderer/stores";

/**
 * 平台操作逻辑封装
 * 职责：封装与 Store 的交互，提供统一的操作接口
 */
export interface PlatformFormData {
  name: string;
  url: string;
  description?: string;
}

export function usePlatformActions() {
  const addPlatform = useAIPlatformsStore((state) => state.addPlatform);
  const updatePlatform = useAIPlatformsStore((state) => state.updatePlatform);
  const removePlatform = useAIPlatformsStore((state) => state.removePlatform);

  // 添加平台
  const handleAddPlatform = (data: PlatformFormData) => {
    addPlatform({
      name: data.name.trim(),
      url: data.url.trim(),
      description: data.description?.trim()
    });
  };

  // 更新平台
  const handleUpdatePlatform = (id: string, data: PlatformFormData) => {
    updatePlatform(id, {
      name: data.name.trim(),
      url: data.url.trim(),
      description: data.description?.trim()
    });
  };

  // 删除平台
  const handleDeletePlatform = (id: string) => {
    removePlatform(id);
  };

  return {
    handleAddPlatform,
    handleUpdatePlatform,
    handleDeletePlatform
  };
}
