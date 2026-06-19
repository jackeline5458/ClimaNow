// ============================================================
// formatters.ts — funções de formatação de dados
// ============================================================

import { WIND_DIRECTIONS } from '@/lib/constants';

/**
 * Formata temperatura com unidade
 */
export function formatTemp(celsius: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): string {
  if (unit === 'fahrenheit') {
    const f = (celsius * 9) / 5 + 32;
    return `${Math.round(f)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

/**
 * Formata temperatura sem unidade (só o número)
 */
export function formatTempValue(celsius: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

/**
 * Formata hora a partir de ISO string
 * Ex: "2024-01-15T14:00" → "14:00"
 */
export function formatHour(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Formata data curta
 * Ex: "2024-01-15" → "Seg 15"
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString + 'T12:00:00');
  const day = date.toLocaleDateString('pt-BR', { weekday: 'short' });
  const num = date.getDate();
  return `${capitalize(day.replace('.', ''))} ${num}`;
}

/**
 * Formata data por extenso
 * Ex: "2024-01-15" → "Segunda-feira, 15 de Janeiro"
 */
export function formatLongDate(dateString: string): string {
  const date = new Date(dateString + 'T12:00:00');
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/**
 * Formata o dia da semana abreviado
 */
export function formatWeekday(dateString: string): string {
  const date = new Date(dateString + 'T12:00:00');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (isSameDay(date, today)) return 'Hoje';
  if (isSameDay(date, tomorrow)) return 'Amanhã';

  return capitalize(
    date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
  );
}

/**
 * Formata hora de nascer/pôr do sol
 */
export function formatSunTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Formata velocidade do vento
 */
export function formatWind(kmh: number): string {
  return `${Math.round(kmh)} km/h`;
}

/**
 * Formata direção do vento em graus → texto
 */
export function formatWindDirection(degrees: number): string {
  const index = Math.round(degrees / 22.5) % 16;
  return WIND_DIRECTIONS[index];
}

/**
 * Formata pressão atmosférica
 */
export function formatPressure(hpa: number): string {
  return `${Math.round(hpa)} hPa`;
}

/**
 * Formata umidade
 */
export function formatHumidity(percent: number): string {
  return `${Math.round(percent)}%`;
}

/**
 * Formata índice UV com descrição
 */
export function formatUV(uv: number): string {
  return uv.toFixed(1);
}

/**
 * Retorna descrição do índice UV
 */
export function getUVDescription(uv: number): string {
  if (uv < 3) return 'Baixo';
  if (uv < 6) return 'Moderado';
  if (uv < 8) return 'Alto';
  if (uv < 11) return 'Muito Alto';
  return 'Extremo';
}

/**
 * Retorna cor do índice UV
 */
export function getUVColor(uv: number): string {
  if (uv < 3) return 'text-green-400';
  if (uv < 6) return 'text-yellow-400';
  if (uv < 8) return 'text-orange-400';
  if (uv < 11) return 'text-red-400';
  return 'text-purple-400';
}

/**
 * Formata precipitação
 */
export function formatPrecipitation(mm: number): string {
  if (mm < 0.1) return '0 mm';
  return `${mm.toFixed(1)} mm`;
}

/**
 * Formata probabilidade de chuva
 */
export function formatPrecipProbability(percent: number): string {
  return `${Math.round(percent)}%`;
}

/**
 * Formata visibilidade
 */
export function formatVisibility(meters: number): string {
  const km = meters / 1000;
  if (km >= 10) return '10+ km';
  return `${km.toFixed(1)} km`;
}

/**
 * Formata "última atualização"
 */
export function formatLastUpdated(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Agora';
  if (diffMin < 60) return `Há ${diffMin} min`;

  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Retorna "hora atual" formatada
 */
export function getCurrentTime(): string {
  return new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Retorna "data atual" formatada
 */
export function getCurrentDate(): string {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

// ─── Helpers internos ────────────────────────────────────────

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
