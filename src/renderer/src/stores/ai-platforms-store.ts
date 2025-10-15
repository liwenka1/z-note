import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AIPlatform } from "@renderer/components/ai-playground/constants/ai-platforms";

interface AIPlatformsState {
  customPlatforms: AIPlatform[];
  addPlatform: (platform: Omit<AIPlatform, "id">) => void;
  updatePlatform: (id: string, platform: Partial<Omit<AIPlatform, "id">>) => void;
  removePlatform: (id: string) => void;
  getPlatformById: (id: string) => AIPlatform | undefined;
}

export const useAIPlatformsStore = create<AIPlatformsState>()(
  persist(
    (set, get) => ({
      customPlatforms: [],

      addPlatform: (platform) => {
        const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newPlatform: AIPlatform = {
          ...platform,
          id
        };
        set((state) => ({
          customPlatforms: [...state.customPlatforms, newPlatform]
        }));
      },

      updatePlatform: (id, updates) => {
        set((state) => ({
          customPlatforms: state.customPlatforms.map((platform) =>
            platform.id === id ? { ...platform, ...updates } : platform
          )
        }));
      },

      removePlatform: (id) => {
        set((state) => ({
          customPlatforms: state.customPlatforms.filter((platform) => platform.id !== id)
        }));
      },

      getPlatformById: (id) => {
        return get().customPlatforms.find((platform) => platform.id === id);
      }
    }),
    {
      name: "ai-platforms-storage"
    }
  )
);
