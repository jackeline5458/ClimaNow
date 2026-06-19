// ============================================================
// useWeather.ts — hook principal de dados de clima
// ============================================================

'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchWeatherData } from '@/services/weatherApi';
import { reverseGeocode } from '@/services/geocodingApi';
import { useWeatherStore } from '@/stores/weatherStore';
import type { Location } from '@/types/weather.types';

interface UseWeatherOptions {
  lat: number | null;
  lon: number | null;
  location?: Location | null;
}

/**
 * Hook que busca e armazena dados de clima para coordenadas dadas.
 * Usa React Query para cache, retry e background refresh.
 */
export function useWeather({ lat, lon, location }: UseWeatherOptions) {
  const { setWeatherData, setError, setLocation, addToHistory } = useWeatherStore();

  const query = useQuery({
    queryKey: ['weather', lat?.toFixed(2), lon?.toFixed(2)],
    enabled: lat !== null && lon !== null,
    staleTime: 10 * 60 * 1000,     // 10 minutos
    gcTime: 30 * 60 * 1000,        // 30 minutos no garbage collector
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),

    queryFn: async () => {
      if (lat === null || lon === null) throw new Error('Coordenadas inválidas');

      // Se não temos nome da localização, fazemos reverse geocoding
      let loc = location;
      if (!loc) {
        loc = await reverseGeocode(lat, lon);
      }

      const data = await fetchWeatherData(lat, lon, loc);

      // Atualiza stores globais
      setWeatherData(data);
      setLocation(loc);

      // Adiciona ao histórico (exceto localização automática)
      if (location) {
        addToHistory({
          name: loc.name,
          country: loc.country,
          countryCode: loc.countryCode,
          region: loc.region,
          lat,
          lon,
        });
      }

      return data;
    },

    // Callbacks de erro
    meta: {
      onError: (error: Error) => {
        setError(error.message);
      },
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook para buscar clima de uma localização salva nos favoritos
 */
export function useFavoriteWeather(lat: number, lon: number, location: Location) {
  return useQuery({
    queryKey: ['weather-favorite', lat.toFixed(2), lon.toFixed(2)],
    queryFn: () => fetchWeatherData(lat, lon, location),
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
