// ============================================================
// WeeklyForecast.tsx — previsão dos próximos 7 dias
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { formatTemp, formatWeekday, formatPrecipProbability } from '@/utils/formatters';
import { getWeatherIcon } from '@/utils/weatherHelpers';
import { useUIStore } from '@/stores/uiStore';
import type { DailyForecast } from '@/types/weather.types';

interface WeeklyForecastProps {
  daily: DailyForecast[];
}

export function WeeklyForecast({ daily }: WeeklyForecastProps) {
  const { unit } = useUIStore();

  // Calcula range global de temperaturas para as barras
  const allTemps = daily.flatMap((d) => [d.tempMin, d.tempMax]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const globalRange = globalMax - globalMin || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="glass-card rounded-3xl p-5 text-white"
    >
      {/* Header */}
      <div className="flex items-center gap-2 text-white/60 mb-4">
        <span className="text-sm">📅</span>
        <span className="text-xs font-medium uppercase tracking-wider">Previsão 7 dias</span>
      </div>

      {/* Lista de dias */}
      <div className="space-y-1">
        {daily.map((day, index) => {
          const minNorm = (day.tempMin - globalMin) / globalRange;
          const maxNorm = (day.tempMax - globalMin) / globalRange;

          return (
            <motion.div
              key={day.date}
              className={`flex items-center gap-3 py-2.5 px-2 rounded-xl transition-colors
                hover:bg-white/10 ${index === 0 ? 'bg-white/10' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              {/* Dia da semana */}
              <span className="w-16 text-sm font-medium text-white/90 shrink-0">
                {formatWeekday(day.date)}
              </span>

              {/* Ícone do clima */}
              <span className="text-xl shrink-0" role="img">
                {getWeatherIcon(day.weatherCode, true)}
              </span>

              {/* Prob. chuva */}
              <div className="w-10 shrink-0">
                {day.precipitationProbability > 10 ? (
                  <span className="text-xs text-blue-200 flex items-center gap-0.5">
                    <span>💧</span>
                    {formatPrecipProbability(day.precipitationProbability)}
                  </span>
                ) : (
                  <span className="text-xs text-white/30">—</span>
                )}
              </div>

              {/* Barra de temperatura min-max */}
              <div className="flex-1 flex items-center gap-2">
                {/* Temp mínima */}
                <span className="text-xs text-white/60 w-8 text-right shrink-0">
                  {formatTemp(day.tempMin, unit)}
                </span>

                {/* Barra de gradiente */}
                <div className="flex-1 h-1.5 bg-white/20 rounded-full relative">
                  <motion.div
                    className="absolute h-full rounded-full"
                    style={{
                      left: `${minNorm * 100}%`,
                      width: `${(maxNorm - minNorm) * 100}%`,
                      background: 'linear-gradient(90deg, #60A5FA, #F97316)',
                    }}
                    initial={{ scaleX: 0, transformOrigin: 'left' }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                  />
                </div>

                {/* Temp máxima */}
                <span className="text-xs font-semibold w-8 text-left shrink-0">
                  {formatTemp(day.tempMax, unit)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
