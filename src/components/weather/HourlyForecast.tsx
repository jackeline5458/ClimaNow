// ============================================================
// HourlyForecast.tsx — previsão horária (próximas 24h)
// ============================================================

'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { formatHour, formatTemp, formatPrecipProbability } from '@/utils/formatters';
import { getWeatherIcon, getNext24Hours } from '@/utils/weatherHelpers';
import { useUIStore } from '@/stores/uiStore';
import type { HourlyForecast as HourlyForecastType } from '@/types/weather.types';

interface HourlyForecastProps {
  hourly: HourlyForecastType[];
}

export function HourlyForecast({ hourly }: HourlyForecastProps) {
  const { unit } = useUIStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const next24 = getNext24Hours(hourly as any);
  // Calcula min/max para barra de temperatura
  const temps = next24.map((h) => Number(h.temperature) || 0);
const minTemp = Math.min(...temps);
const maxTemp = Math.max(...temps);
const tempRange = maxTemp - minTemp || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card rounded-3xl p-5 text-white"
    >
      {/* Header */}
      <div className="flex items-center gap-2 text-white/60 mb-4">
        <span className="text-sm">🕐</span>
        <span className="text-xs font-medium uppercase tracking-wider">Próximas 24 horas</span>
      </div>

      {/* Scroll horizontal */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {next24.map((hour, index) => {
          const tempNorm = (hour.temperature - minTemp) / tempRange;
          const isNow = index === 0;

          return (
            <motion.div
              key={hour.time}
              className={`flex-shrink-0 flex flex-col items-center gap-2 snap-start
                px-3 py-3 rounded-2xl transition-colors min-w-[64px]
                ${isNow ? 'bg-white/20' : 'hover:bg-white/10'}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03, duration: 0.3 }}
            >
              {/* Hora */}
              <span className={`text-xs font-medium ${isNow ? 'text-white' : 'text-white/70'}`}>
                {isNow ? 'Agora' : formatHour(hour.time)}
              </span>

              {/* Ícone */}
              <span className="text-2xl" role="img" aria-label={`clima às ${formatHour(hour.time)}`}>
                {getWeatherIcon(hour.weatherCode, hour.isDay)}
              </span>

              {/* Temperatura */}
              <span className="text-sm font-semibold">
                {formatTemp(hour.temperature, unit)}
              </span>

              {/* Barra de temperatura relativa */}
              <div className="w-1 h-12 bg-white/20 rounded-full relative overflow-hidden">
                <motion.div
                  className="absolute bottom-0 w-full rounded-full"
                  style={{
                    background: `hsl(${tempNorm * 60 + 200}deg, 80%, 70%)`,
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${tempNorm * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.03 }}
                />
              </div>

              {/* Probabilidade de chuva (se > 10%) */}
              {hour.precipitationProbability > 10 && (
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px]">💧</span>
                  <span className="text-[10px] text-blue-200">
                    {formatPrecipProbability(hour.precipitationProbability)}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
