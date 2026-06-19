// ============================================================
// page.tsx — página principal do ClimaNow
// ============================================================

'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { WeatherBackground } from '@/components/weather/WeatherBackground';
import { CurrentWeather } from '@/components/weather/CurrentWeather';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { WeeklyForecast } from '@/components/weather/WeeklyForecast';
import { SmartTips } from '@/components/weather/SmartTips';
import { Header } from '@/components/layout/Header';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { ErrorMessage, WelcomeMessage } from '@/components/shared/ErrorMessage';

import { useGeolocation } from '@/hooks/useGeolocation';
import { useWeather } from '@/hooks/useWeather';
import { useWeatherStore } from '@/stores/weatherStore';
import { geocodingToLocation } from '@/services/geocodingApi';
import type { GeocodingResult, Location } from '@/types/weather.types';

export default function HomePage() {
  // Coordenadas selecionadas (geolocação ou busca)
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const geolocation = useGeolocation();
  const { weatherData, currentLocation } = useWeatherStore();

  // Hook principal de clima
  const weather = useWeather({
    lat: coords?.lat ?? null,
    lon: coords?.lon ?? null,
    location: selectedLocation,
  });

  // Ao montar, tenta restaurar última localização salva
  useEffect(() => {
    if (currentLocation) {
      setCoords({ lat: currentLocation.lat, lon: currentLocation.lon });
      setSelectedLocation(currentLocation);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Quando geolocalização retorna coordenadas
  useEffect(() => {
    if (geolocation.lat && geolocation.lon) {
      setCoords({ lat: geolocation.lat, lon: geolocation.lon });
      setSelectedLocation(null); // sem localização pré-definida → reverse geocode
    }
  }, [geolocation.lat, geolocation.lon]);

  // Handlers
  const handleSelectLocation = useCallback(
    (lat: number, lon: number, location?: Location) => {
      setCoords({ lat, lon });
      setSelectedLocation(location ?? null);
    },
    []
  );

  const handleRequestGeolocation = useCallback(() => {
    geolocation.requestLocation();
  }, [geolocation]);

  const handleRefresh = useCallback(() => {
    weather.refetch();
  }, [weather]);

  // Estados de renderização
  const isFirstLoad = !coords;
  const isLoading = weather.isLoading || geolocation.isLoading;
  const hasError = weather.isError || !!geolocation.error;
  const hasData = !!weatherData;

  const errorMessage =
    weather.error?.message ||
    geolocation.error ||
    'Não foi possível carregar os dados.';

  const errorType = geolocation.error
    ? 'location'
    : weather.isError
    ? 'network'
    : 'generic';

  // Fundo padrão enquanto não temos dados
  const bgCode = weatherData?.current.weatherCode ?? 0;
  const isDay = weatherData?.current.isDay ?? true;

  return (
    <WeatherBackground weatherCode={bgCode} isDay={isDay}>
      {/* Header sempre visível */}
      <Header
        onSelectLocation={handleSelectLocation}
        onRequestGeolocation={handleRequestGeolocation}
        onRefresh={handleRefresh}
        isRefreshing={weather.isFetching}
        updatedAt={weatherData?.updatedAt}
      />

      {/* Conteúdo principal */}
      <main className="pb-safe-bottom pb-8">
        <AnimatePresence mode="wait">
          {/* Tela inicial */}
          {isFirstLoad && !isLoading && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <WelcomeMessage onRequestLocation={handleRequestGeolocation} />
            </motion.div>
          )}

          {/* Loading skeleton */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSkeleton />
            </motion.div>
          )}

          {/* Erro */}
          {hasError && !isLoading && !hasData && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-20"
            >
              <ErrorMessage
                message={errorMessage}
                type={errorType}
                onRetry={weather.isError ? handleRefresh : undefined}
                onRequestLocation={geolocation.error ? handleRequestGeolocation : undefined}
              />
            </motion.div>
          )}

          {/* Dados de clima */}
          {hasData && !isLoading && weatherData && (
            <motion.div
              key={`weather-${weatherData.location.lat}-${weatherData.location.lon}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <WeatherContent data={weatherData} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </WeatherBackground>
  );
}

// ─── WeatherContent ──────────────────────────────────────────

import type { WeatherData } from '@/types/weather.types';

function WeatherContent({ data }: { data: WeatherData }) {
  return (
    <div className="max-w-2xl mx-auto px-4 space-y-4 pt-2">
      {/* Clima atual + métricas */}
      <CurrentWeather
        data={data.current}
        locationName={data.location.name}
        locationRegion={
          data.location.region
            ? `${data.location.region}, ${data.location.country}`
            : data.location.country
        }
      />

      {/* Previsão horária */}
      <HourlyForecast hourly={data.hourly} />

      {/* Previsão semanal */}
      <WeeklyForecast daily={data.daily} />

      {/* Dicas inteligentes */}
      <SmartTips current={data.current} />

      {/* Rodapé */}
      <footer className="text-center text-white/30 text-xs pb-4">
        <p>Dados: Open-Meteo • ClimaNow</p>
      </footer>
    </div>
  );
}
