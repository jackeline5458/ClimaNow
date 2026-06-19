// ============================================================
// uiStore.ts — estado global de UI com Zustand
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UIStore } from '@/types/weather.types';

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      unit: 'celsius',
      activeTab: 'current',

      setTheme: (theme) => set({ theme }),

      toggleUnit: () => {
        const { unit } = get();
        set({ unit: unit === 'celsius' ? 'fahrenheit' : 'celsius' });
      },

      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'climanow-ui',
    }
  )
);
