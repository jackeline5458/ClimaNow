// ============================================================
// weatherStore.ts — estado global de clima com Zustand
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CACHE_CONFIG, STORAGE_KEYS } from '@/lib/constants';
import type {
  WeatherStore,
  Location,
  WeatherData,
  FavoriteCity,
  SearchHistory,
} from '@/types/weather.types';

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set, get) => ({
      currentLocation: null,
      weatherData: null,
      favorites: [],
      searchHistory: [],
      isLoading: false,
      error: null,

      setLocation: (location: Location) => set({ currentLocation: location }),

      setWeatherData: (data: WeatherData) => set({ weatherData: data, error: null }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

      addFavorite: (city: FavoriteCity) => {
        const { favorites } = get();
        const already = favorites.some(
          (f) => Math.abs(f.lat - city.lat) < 0.01 && Math.abs(f.lon - city.lon) < 0.01
        );
        if (already) return;

        const updated = [city, ...favorites].slice(0, CACHE_CONFIG.MAX_FAVORITES);
        set({ favorites: updated });
      },

      removeFavorite: (id: string) => {
        const { favorites } = get();
        set({ favorites: favorites.filter((f) => f.id !== id) });
      },

      isFavorite: (lat: number, lon: number): boolean => {
        const { favorites } = get();
        return favorites.some(
          (f) => Math.abs(f.lat - lat) < 0.01 && Math.abs(f.lon - lon) < 0.01
        );
      },

      addToHistory: (item) => {
        const { searchHistory } = get();
        // Remove duplicata
        const filtered = searchHistory.filter(
          (h) => Math.abs(h.lat - item.lat) > 0.01 || Math.abs(h.lon - item.lon) > 0.01
        );
        const newEntry: SearchHistory = {
          ...item,
          id: `history-${Date.now()}`,
          searchedAt: new Date().toISOString(),
        };
        const updated = [newEntry, ...filtered].slice(0, CACHE_CONFIG.MAX_HISTORY_ITEMS);
        set({ searchHistory: updated });
      },

      clearHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: 'climanow-weather',
      partialize: (state) => ({
        favorites: state.favorites,
        searchHistory: state.searchHistory,
        currentLocation: state.currentLocation,
      }),
    }
  )
);
