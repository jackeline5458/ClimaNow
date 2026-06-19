// ============================================================
// Header.tsx — cabeçalho do app com busca, favoritos e tema
// ============================================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, StarOff, Sun, Moon, Thermometer, RefreshCw } from 'lucide-react';
import { SearchBar } from '@/components/weather/SearchBar';
import { useWeatherStore } from '@/stores/weatherStore';
import { useUIStore } from '@/stores/uiStore';
import { formatLastUpdated } from '@/utils/formatters';
import type { Location } from '@/types/weather.types';

interface HeaderProps {
  onSelectLocation: (lat: number, lon: number, location?: Location) => void;
  onRequestGeolocation: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  updatedAt?: string;
}

export function Header({
  onSelectLocation,
  onRequestGeolocation,
  onRefresh,
  isRefreshing,
  updatedAt,
}: HeaderProps) {
  const { weatherData, isFavorite, addFavorite, removeFavorite } = useWeatherStore();
  const { theme, setTheme, unit, toggleUnit } = useUIStore();
  const [showActions, setShowActions] = useState(false);

  const location = weatherData?.location;
  const coords = location ? { lat: location.lat, lon: location.lon } : null;
  const alreadyFav = coords ? isFavorite(coords.lat, coords.lon) : false;

  function handleToggleFavorite() {
    if (!location) return;
    const id = `fav-${location.lat.toFixed(3)}-${location.lon.toFixed(3)}`;

    if (alreadyFav) {
      const { favorites } = useWeatherStore.getState();
      const fav = favorites.find(
        (f) => Math.abs(f.lat - location.lat) < 0.01 && Math.abs(f.lon - location.lon) < 0.01
      );
      if (fav) removeFavorite(fav.id);
    } else {
      addFavorite({
        id,
        name: location.name,
        country: location.country,
        countryCode: location.countryCode,
        region: location.region,
        lat: location.lat,
        lon: location.lon,
        addedAt: new Date().toISOString(),
      });
    }
  }

  function handleThemeToggle() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <header className="relative z-20 px-4 pt-safe-top pt-4 pb-2">
      <div className="max-w-2xl mx-auto space-y-3">
        {/* Barra de busca principal */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchBar onSelectLocation={(lat, lon) => onSelectLocation(lat, lon)} />
          </div>

          {/* Ações rápidas */}
          <div className="flex items-center gap-1.5">
            {/* Minha localização */}
            <ActionButton
              onClick={onRequestGeolocation}
              label="Minha localização"
              className="bg-white/20 hover:bg-white/30"
            >
              <MapPin className="w-4 h-4 text-white" />
            </ActionButton>

            {/* Favorito */}
            {location && (
              <ActionButton
                onClick={handleToggleFavorite}
                label={alreadyFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                className={`${alreadyFav ? 'bg-yellow-400/30 hover:bg-yellow-400/40' : 'bg-white/20 hover:bg-white/30'}`}
              >
                {alreadyFav
                  ? <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  : <StarOff className="w-4 h-4 text-white" />
                }
              </ActionButton>
            )}

            {/* Tema */}
            <ActionButton
              onClick={handleThemeToggle}
              label="Alternar tema"
              className="bg-white/20 hover:bg-white/30"
            >
              {theme === 'dark'
                ? <Sun className="w-4 h-4 text-yellow-300" />
                : <Moon className="w-4 h-4 text-white" />
              }
            </ActionButton>

            {/* Unidade */}
            <ActionButton
              onClick={toggleUnit}
              label="Alternar unidade de temperatura"
              className="bg-white/20 hover:bg-white/30"
            >
              <span className="text-white text-xs font-bold">
                {unit === 'celsius' ? '°C' : '°F'}
              </span>
            </ActionButton>
          </div>
        </div>

        {/* Barra de status: atualização + refresh */}
        {updatedAt && (
          <div className="flex items-center justify-between px-1">
            <span className="text-white/40 text-xs">
              Atualizado {formatLastUpdated(updatedAt)}
            </span>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1 text-white/40 hover:text-white/70 text-xs transition-colors"
              aria-label="Atualizar dados"
            >
              <RefreshCw
                className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              <span>Atualizar</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

// ─── ActionButton ─────────────────────────────────────────────

interface ActionButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
  children: React.ReactNode;
}

function ActionButton({ onClick, label, className = '', children }: ActionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`w-10 h-10 rounded-xl flex items-center justify-center
        backdrop-blur-md border border-white/20 transition-colors ${className}`}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
    >
      {children}
    </motion.button>
  );
}
