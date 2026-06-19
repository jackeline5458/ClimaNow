// ============================================================
// cacheService.ts — cache em memória + localStorage
// ============================================================

import { CACHE_CONFIG } from '@/lib/constants';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/** Cache em memória (session) */
const memoryCache = new Map<string, CacheEntry<unknown>>();

/**
 * Salva dado no cache
 */
export function setCache<T>(key: string, data: T, ttl: number = CACHE_CONFIG.WEATHER_TTL): void {
  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

/**
 * Recupera dado do cache (retorna null se expirado)
 */
export function getCache<T>(key: string): T | null {
  const entry = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > entry.ttl;
  if (isExpired) {
    memoryCache.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * Remove item do cache
 */
export function deleteCache(key: string): void {
  memoryCache.delete(key);
}

/**
 * Limpa todo o cache
 */
export function clearCache(): void {
  memoryCache.clear();
}

/**
 * Gera chave de cache para clima por coordenadas
 */
export function getWeatherCacheKey(lat: number, lon: number): string {
  // Arredonda para 2 casas decimais para reutilizar cache de locais próximos
  return `weather:${lat.toFixed(2)},${lon.toFixed(2)}`;
}

/**
 * Gera chave de cache para busca de cidades
 */
export function getGeocodingCacheKey(query: string): string {
  return `geocoding:${query.toLowerCase().trim()}`;
}

// ─── localStorage helpers ────────────────────────────────────

/**
 * Salva no localStorage de forma segura
 */
export function setLocalStorage<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage.setItem falhou:', e);
  }
}

/**
 * Recupera do localStorage de forma segura
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined') return defaultValue;
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn('localStorage.getItem falhou:', e);
    return defaultValue;
  }
}

/**
 * Remove do localStorage de forma segura
 */
export function removeLocalStorage(key: string): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('localStorage.removeItem falhou:', e);
  }
}
