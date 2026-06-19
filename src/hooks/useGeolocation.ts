// ============================================================
// useGeolocation.ts — hook de geolocalização do browser
// ============================================================

'use client';

import { useState, useCallback } from 'react';

interface GeolocationState {
  lat: number | null;
  lon: number | null;
  error: string | null;
  isLoading: boolean;
}

interface UseGeolocationReturn extends GeolocationState {
  requestLocation: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lon: null,
    error: null,
    isLoading: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocalização não suportada neste navegador.',
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          error: null,
          isLoading: false,
        });
      },
      (err) => {
        let message = 'Não foi possível obter sua localização.';
        switch (err.code) {
          case GeolocationPositionError.PERMISSION_DENIED:
            message = 'Permissão de localização negada. Habilite nas configurações do navegador.';
            break;
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            message = 'Localização indisponível no momento.';
            break;
          case GeolocationPositionError.TIMEOUT:
            message = 'Tempo esgotado ao buscar localização.';
            break;
        }
        setState({
          lat: null,
          lon: null,
          error: message,
          isLoading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutos de cache
      }
    );
  }, []);

  return { ...state, requestLocation };
}
