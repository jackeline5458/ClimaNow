// ============================================================
// geocodingApi.ts — integração com Open-Meteo Geocoding
// ============================================================

import { API_URLS } from '@/lib/constants';
import type { GeocodingResult, Location } from '@/types/weather.types';

interface GeocodingAPIResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    country_code: string;
    admin1?: string;
    admin2?: string;
    population?: number;
    timezone?: string;
  }>;
}

/**
 * Busca cidades pelo nome
 * @param query - Nome da cidade
 * @param count - Número máximo de resultados (padrão: 8)
 */
export async function searchCities(
  query: string,
  count: number = 8
): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) return [];

  const params = new URLSearchParams({
    name: query.trim(),
    count: count.toString(),
    language: 'pt',
    format: 'json',
  });

  const url = `${API_URLS.GEOCODING}?${params}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Erro ao buscar cidades: ${res.status}`);
  }

  const data: GeocodingAPIResponse = await res.json();
  return data.results ?? [];
}

/**
 * Converte resultado de geocodificação em Location
 */
export function geocodingToLocation(result: GeocodingResult): Location {
  return {
    name: result.name,
    country: result.country,
    countryCode: result.country_code,
    region: result.admin1,
    lat: result.latitude,
    lon: result.longitude,
    timezone: result.timezone,
  };
}

/**
 * Busca informações de localização por coordenadas (reverse geocoding)
 * Open-Meteo não tem reverse geocoding, então usamos nominatim como fallback
 */
export async function reverseGeocode(lat: number, lon: number): Promise<Location> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=pt`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ClimaNow/1.0' },
    });

    if (!res.ok) throw new Error('Reverse geocoding falhou');

    const data = await res.json();

    const name =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.municipality ||
      'Localização atual';

    const country = data.address?.country ?? '';
    const countryCode = (data.address?.country_code ?? '').toUpperCase();
    const region = data.address?.state;

    return { name, country, countryCode, region, lat, lon };
  } catch {
    // Fallback se nominatim falhar
    return {
      name: 'Minha localização',
      country: '',
      countryCode: '',
      lat,
      lon,
    };
  }
}

/**
 * Formata o nome de exibição de uma cidade
 */
export function formatCityDisplay(result: GeocodingResult): string {
  const parts = [result.name];
  if (result.admin1) parts.push(result.admin1);
  parts.push(result.country);
  return parts.join(', ');
}
