// ============================================================
// SearchBar.tsx — barra de busca com autocomplete
// ============================================================

'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, MapPin, Clock, Star } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { useWeatherStore } from '@/stores/weatherStore';
import { geocodingToLocation } from '@/services/geocodingApi';
import type { GeocodingResult } from '@/types/weather.types';

interface SearchBarProps {
  onSelectLocation: (lat: number, lon: number) => void;
}

export function SearchBar({ onSelectLocation }: SearchBarProps) {
  const { query, setQuery, results, isSearching, isOpen, setIsOpen, clearSearch } = useSearch();
  const { searchHistory, favorites, clearHistory } = useWeatherStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [setIsOpen]);

  function handleSelect(result: GeocodingResult) {
    onSelectLocation(result.latitude, result.longitude);
    clearSearch();
    inputRef.current?.blur();
  }

  const showHistory = !isOpen && query.length === 0 && (searchHistory.length > 0 || favorites.length > 0);
  const showResults = isOpen && results.length > 0;
  const showEmpty = isOpen && !isSearching && results.length === 0 && query.length >= 2;

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      {/* Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
          {isSearching
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Search className="w-4 h-4" />
          }
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Buscar cidade..."
          className="w-full bg-white/20 backdrop-blur-md text-white placeholder-white/50
            rounded-2xl py-3 pl-10 pr-10 text-sm outline-none
            border border-white/20 focus:border-white/40 focus:bg-white/25
            transition-all duration-200"
          aria-label="Buscar cidade"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={isOpen}
        />

        {query && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            onClick={() => { clearSearch(); inputRef.current?.focus(); }}
            aria-label="Limpar busca"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown de resultados */}
      <AnimatePresence>
        {(showResults || showEmpty || showHistory) && (
          <motion.div
            id="search-results"
            role="listbox"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 right-0 z-50
              bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/10
              shadow-2xl overflow-hidden"
          >
            {/* Resultados de busca */}
            {showResults && (
              <>
                <div className="px-3 pt-2 pb-1">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">
                    Resultados
                  </span>
                </div>
                {results.map((result) => (
                  <SearchResultItem
                    key={result.id}
                    result={result}
                    onSelect={() => handleSelect(result)}
                  />
                ))}
              </>
            )}

            {/* Sem resultados */}
            {showEmpty && (
              <div className="p-4 text-center text-white/50 text-sm">
                Nenhuma cidade encontrada para "{query}"
              </div>
            )}

            {/* Histórico e favoritos */}
            {showHistory && (
              <>
                {favorites.length > 0 && (
                  <>
                    <div className="px-3 pt-2 pb-1 flex items-center justify-between">
                      <span className="text-[10px] text-white/40 uppercase tracking-wider">
                        Favoritos
                      </span>
                    </div>
                    {favorites.slice(0, 3).map((city) => (
                      <button
                        key={city.id}
                        className="w-full flex items-center gap-3 px-4 py-2.5
                          hover:bg-white/10 transition-colors text-left"
                        onClick={() => {
                          onSelectLocation(city.lat, city.lon);
                          setIsOpen(false);
                        }}
                      >
                        <Star className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                        <div>
                          <p className="text-sm text-white font-medium">{city.name}</p>
                          <p className="text-xs text-white/50">{city.country}</p>
                        </div>
                      </button>
                    ))}
                  </>
                )}

                {searchHistory.length > 0 && (
                  <>
                    <div className="px-3 pt-2 pb-1 flex items-center justify-between">
                      <span className="text-[10px] text-white/40 uppercase tracking-wider">
                        Histórico
                      </span>
                      <button
                        className="text-[10px] text-white/30 hover:text-white/60"
                        onClick={clearHistory}
                      >
                        Limpar
                      </button>
                    </div>
                    {searchHistory.slice(0, 5).map((item) => (
                      <button
                        key={item.id}
                        className="w-full flex items-center gap-3 px-4 py-2.5
                          hover:bg-white/10 transition-colors text-left"
                        onClick={() => {
                          onSelectLocation(item.lat, item.lon);
                          setIsOpen(false);
                        }}
                      >
                        <Clock className="w-3.5 h-3.5 text-white/40 shrink-0" />
                        <div>
                          <p className="text-sm text-white">{item.name}</p>
                          <p className="text-xs text-white/50">
                            {item.region ? `${item.region}, ` : ''}{item.country}
                          </p>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Item de resultado ───────────────────────────────────────

interface SearchResultItemProps {
  result: GeocodingResult;
  onSelect: () => void;
}

function SearchResultItem({ result, onSelect }: SearchResultItemProps) {
  return (
    <button
      role="option"
      className="w-full flex items-center gap-3 px-4 py-2.5
        hover:bg-white/10 transition-colors text-left"
      onClick={onSelect}
    >
      <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate">{result.name}</p>
        <p className="text-xs text-white/50 truncate">
          {[result.admin1, result.country].filter(Boolean).join(', ')}
        </p>
      </div>
      {result.population && result.population > 100000 && (
        <span className="text-[10px] text-white/30 shrink-0">
          {(result.population / 1000).toFixed(0)}k hab
        </span>
      )}
    </button>
  );
}
