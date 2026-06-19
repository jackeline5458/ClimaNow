// ============================================================
// CurrentWeather.tsx — card principal de clima atual
// ============================================================

'use client';

import { motion } from 'framer-motion';
import {
  Wind, Droplets, Eye, Gauge, Sunrise, Sunset,
  Thermometer, CloudRain
} from 'lucide-react';
import {
  formatTemp, formatWind, formatWindDirection, formatPressure,
  formatHumidity, formatUV, getUVDescription, getUVColor,
  formatSunTime, formatPrecipitation, formatVisibility,
  formatTempValue,
} from '@/utils/formatters';
import { getWeatherIcon, getDayProgress } from '@/utils/weatherHelpers';
import { useUIStore } from '@/stores/uiStore';
import type { CurrentWeather as CurrentWeatherType } from '@/types/weather.types';

interface CurrentWeatherProps {
  data: CurrentWeatherType;
  locationName: string;
  locationRegion?: string;
}

export function CurrentWeather({ data, locationName, locationRegion }: CurrentWeatherProps) {
  const { unit } = useUIStore();
  const dayProgress = getDayProgress(data.sunrise, data.sunset);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      {/* Card principal de temperatura */}
      <div className="glass-card rounded-3xl p-6 text-white">
        {/* Localização */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">{locationName}</h2>
          {locationRegion && (
            <p className="text-white/60 text-sm">{locationRegion}</p>
          )}
        </div>

        {/* Temperatura + ícone */}
        <div className="flex items-end justify-between mb-2">
          <div>
            <motion.span
              key={`${data.temperature}-${unit}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-8xl font-thin leading-none tracking-tighter"
            >
              {formatTempValue(data.temperature, unit)}°
            </motion.span>
          </div>
          <motion.span
            className="text-7xl leading-none mb-1"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {getWeatherIcon(data.weatherCode, data.isDay)}
          </motion.span>
        </div>

        {/* Descrição */}
        <p className="text-xl text-white/90 mb-4">{data.description}</p>

        {/* Min/Max e sensação */}
        <div className="flex gap-4 text-sm text-white/80">
          <span>↑ {formatTemp(data.tempMax, unit)}</span>
          <span>↓ {formatTemp(data.tempMin, unit)}</span>
          <span>Sensação {formatTemp(data.feelsLike, unit)}</span>
        </div>
      </div>

      {/* Grid de métricas */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
        <MetricCard
          icon={<Droplets className="w-4 h-4" />}
          label="Umidade"
          value={formatHumidity(data.humidity)}
        />
        <MetricCard
          icon={<Wind className="w-4 h-4" />}
          label="Vento"
          value={formatWind(data.windSpeed)}
          sub={formatWindDirection(data.windDirection)}
        />
        <MetricCard
          icon={<span className="text-sm">🌡️</span>}
          label="UV"
          value={formatUV(data.uvIndex)}
          sub={getUVDescription(data.uvIndex)}
          valueClass={getUVColor(data.uvIndex)}
        />
        <MetricCard
          icon={<Gauge className="w-4 h-4" />}
          label="Pressão"
          value={formatPressure(data.pressure)}
        />
        <MetricCard
          icon={<Eye className="w-4 h-4" />}
          label="Visibilidade"
          value={formatVisibility(data.visibility)}
        />
        <MetricCard
          icon={<CloudRain className="w-4 h-4" />}
          label="Precipitação"
          value={formatPrecipitation(data.precipitation)}
          sub="agora"
        />
      </div>

      {/* Arco solar — nascer e pôr do sol */}
      <SunArc
        sunrise={data.sunrise}
        sunset={data.sunset}
        progress={dayProgress}
        isDay={data.isDay}
      />
    </motion.div>
  );
}

// ─── Componentes internos ────────────────────────────────────

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
}

function MetricCard({ icon, label, value, sub, valueClass }: MetricCardProps) {
  return (
    <motion.div
      className="glass-card rounded-2xl p-4 text-white"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="flex items-center gap-2 text-white/60 mb-2">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-xl font-semibold ${valueClass ?? ''}`}>{value}</p>
      {sub && <p className="text-xs text-white/50 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

interface SunArcProps {
  sunrise: string;
  sunset: string;
  progress: number;
  isDay: boolean;
}

function SunArc({ sunrise, sunset, progress, isDay }: SunArcProps) {
  const angle = (progress / 100) * 180 - 90; // -90° (leste) a 90° (oeste)
  const rad = (angle * Math.PI) / 180;
  const cx = 50;
  const cy = 80;
  const r = 40;
  const sunX = cx + r * Math.cos(rad - Math.PI / 2);
  const sunY = cy - r * Math.sin(rad - Math.PI / 2 + Math.PI) + r;

  return (
    <div className="glass-card rounded-2xl p-5 text-white">
      <div className="flex items-center gap-2 text-white/60 mb-3">
        <Sunrise className="w-4 h-4" />
        <span className="text-xs uppercase tracking-wider">Sol</span>
      </div>

      {/* SVG do arco */}
      <div className="relative">
        <svg viewBox="0 0 100 55" className="w-full" aria-hidden>
          {/* Arco de fundo */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Arco de progresso */}
          {isDay && (
            <path
              d={`M 10 50 A 40 40 0 0 1 ${sunX} ${sunY}`}
              fill="none"
              stroke="rgba(255,220,50,0.7)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
          {/* Sol */}
          {isDay && (
            <motion.circle
              cx={sunX}
              cy={sunY}
              r="4"
              fill="#FFD700"
              filter="url(#glow)"
              initial={false}
              animate={{ cx: sunX, cy: sunY }}
              transition={{ duration: 0.5 }}
            />
          )}
          {/* Lua (noite) */}
          {!isDay && (
            <text x="47" y="40" fontSize="10" textAnchor="middle">🌙</text>
          )}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Horários */}
        <div className="flex justify-between text-xs text-white/70 mt-1">
          <div className="flex items-center gap-1">
            <Sunrise className="w-3 h-3 text-yellow-300" />
            <span>{formatSunTime(sunrise)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Sunset className="w-3 h-3 text-orange-300" />
            <span>{formatSunTime(sunset)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
