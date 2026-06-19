// ============================================================
// weatherHelpers.ts — helpers de lógica de clima
// ============================================================

import { WEATHER_CODES, WEATHER_BACKGROUNDS, TIP_THRESHOLDS } from '@/lib/constants';
import type { CurrentWeather, SmartTip, DailyForecast } from '@/types/weather.types';

/**
 * Retorna descrição textual de um WMO code
 */
export function getWeatherDescription(code: number): string {
  return WEATHER_CODES[code]?.description ?? 'Condição desconhecida';
}

/**
 * Retorna emoji/ícone de um WMO code
 */
export function getWeatherIcon(code: number, isDay: boolean = true): string {
  const entry = WEATHER_CODES[code];
  if (!entry) return '🌡️';
  if (!isDay && entry.iconNight) return entry.iconNight;
  return entry.icon;
}

/**
 * Retorna a "categoria" de clima para fins de background
 */
export function getWeatherCategory(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? 'clear_day' : 'clear_night';
  if (code <= 2) return isDay ? 'partly_cloudy_day' : 'partly_cloudy_night';
  if (code === 3) return 'cloudy';
  if (code <= 48) return 'foggy';
  if (code <= 55) return 'drizzle';
  if (code <= 67) return 'rain';
  if (code <= 77) return 'snow';
  if (code <= 82) return 'rain';
  if (code <= 86) return 'snow';
  return 'thunderstorm';
}

/**
 * Retorna gradiente de fundo baseado no clima atual
 */
export function getWeatherBackground(code: number, isDay: boolean): {
  from: string;
  to: string;
  via?: string;
} {
  const category = getWeatherCategory(code, isDay);
  return WEATHER_BACKGROUNDS[category] ?? WEATHER_BACKGROUNDS['clear_day'];
}

/**
 * Gera CSS de gradiente como string inline
 */
export function getBackgroundCSS(code: number, isDay: boolean): string {
  const { from, via, to } = getWeatherBackground(code, isDay);
  if (via) {
    return `linear-gradient(135deg, ${from}, ${via}, ${to})`;
  }
  return `linear-gradient(135deg, ${from}, ${to})`;
}

/**
 * Gera dicas inteligentes baseadas nos dados do clima
 */
export function generateSmartTips(current: CurrentWeather): SmartTip[] {
  const tips: SmartTip[] = [];
  const { temperature, feelsLike, uvIndex, humidity, precipitation, windSpeed } = current;

  // ── Temperatura ──────────────────────────────────────────

  if (temperature > TIP_THRESHOLDS.HIGH_TEMP) {
    tips.push({
      id: 'hydration',
      category: 'health',
      icon: '💧',
      title: 'Hidrate-se bem',
      description: `Com ${Math.round(temperature)}°C, seu corpo perde água rapidamente. Beba pelo menos 2L de água hoje.`,
      priority: 'high',
    });
  }

  if (temperature < TIP_THRESHOLDS.LOW_TEMP) {
    tips.push({
      id: 'coat',
      category: 'clothing',
      icon: '🧥',
      title: 'Casaco é essencial',
      description: `Temperatura de ${Math.round(temperature)}°C. Vista roupas em camadas e não esqueça o casaco.`,
      priority: 'high',
    });
  }

  if (temperature < TIP_THRESHOLDS.COLD_TEMP) {
    tips.push({
      id: 'frost',
      category: 'alert',
      icon: '❄️',
      title: 'Risco de geada',
      description: 'Temperaturas abaixo de 5°C. Proteja plantas sensíveis e cuidado com pistas molhadas.',
      priority: 'high',
    });
  }

  // Sensação térmica muito diferente da real
  if (Math.abs(feelsLike - temperature) > 5) {
    tips.push({
      id: 'feels_like',
      category: 'clothing',
      icon: '🌡️',
      title: 'Sensação diferente',
      description: `A sensação térmica é de ${Math.round(feelsLike)}°C — ${feelsLike < temperature ? 'mais frio' : 'mais quente'} do que o termômetro indica.`,
      priority: 'medium',
    });
  }

  // ── UV ───────────────────────────────────────────────────

  if (uvIndex > TIP_THRESHOLDS.HIGH_UV) {
    tips.push({
      id: 'uv_high',
      category: 'health',
      icon: '☀️',
      title: 'UV extremo — use protetor',
      description: `Índice UV ${uvIndex.toFixed(0)} (${uvIndex >= 11 ? 'extremo' : 'muito alto'}). Use FPS 50+, óculos e chapéu. Evite sol das 10h às 16h.`,
      priority: 'high',
    });
  } else if (uvIndex > TIP_THRESHOLDS.MODERATE_UV) {
    tips.push({
      id: 'uv_moderate',
      category: 'health',
      icon: '🕶️',
      title: 'Proteção solar recomendada',
      description: `Índice UV ${uvIndex.toFixed(0)}. Aplique protetor solar FPS 30+ e use óculos escuros.`,
      priority: 'medium',
    });
  }

  // ── Umidade ──────────────────────────────────────────────

  if (humidity < TIP_THRESHOLDS.LOW_HUMIDITY) {
    tips.push({
      id: 'dry_skin',
      category: 'health',
      icon: '🧴',
      title: 'Ar muito seco',
      description: `Umidade de apenas ${Math.round(humidity)}%. Hidrate a pele, use colírio se necessário e beba bastante água.`,
      priority: 'medium',
    });
  }

  if (humidity > TIP_THRESHOLDS.HIGH_HUMIDITY) {
    tips.push({
      id: 'high_humidity',
      category: 'health',
      icon: '💦',
      title: 'Umidade alta',
      description: `Com ${Math.round(humidity)}% de umidade, a sensação de calor é amplificada. Use roupas leves e ventiladas.`,
      priority: 'low',
    });
  }

  // ── Chuva ─────────────────────────────────────────────────

  if (precipitation > TIP_THRESHOLDS.RAIN_THRESHOLD) {
    tips.push({
      id: 'umbrella',
      category: 'alert',
      icon: '☂️',
      title: 'Guarda-chuva obrigatório',
      description: `Precipitação de ${precipitation.toFixed(1)}mm/h. Não saia sem guarda-chuva e cuidado com enchentes.`,
      priority: 'high',
    });
  } else if (precipitation > 0.5) {
    tips.push({
      id: 'light_rain',
      category: 'clothing',
      icon: '🌂',
      title: 'Garoa presente',
      description: 'Leve um guarda-chuva compacto, por precaução.',
      priority: 'low',
    });
  }

  // ── Vento ─────────────────────────────────────────────────

  if (windSpeed > TIP_THRESHOLDS.HIGH_WIND) {
    tips.push({
      id: 'high_wind',
      category: 'alert',
      icon: '💨',
      title: 'Vento forte — cuidado!',
      description: `Rajadas de ${Math.round(windSpeed)} km/h. Prenda objetos soltos, evite árvores e estruturas frágeis.`,
      priority: 'high',
    });
  } else if (windSpeed > TIP_THRESHOLDS.MODERATE_WIND) {
    tips.push({
      id: 'moderate_wind',
      category: 'clothing',
      icon: '🍃',
      title: 'Vento moderado',
      description: `${Math.round(windSpeed)} km/h. Roupas leves podem não ser suficientes lá fora.`,
      priority: 'low',
    });
  }

  // ── Condições ideais ──────────────────────────────────────

  const isPleasant =
    temperature >= TIP_THRESHOLDS.PLEASANT_TEMP_MIN &&
    temperature <= TIP_THRESHOLDS.PLEASANT_TEMP_MAX &&
    precipitation < 1 &&
    windSpeed < TIP_THRESHOLDS.MODERATE_WIND;

  if (isPleasant) {
    tips.push({
      id: 'outdoor',
      category: 'activity',
      icon: '🏃',
      title: 'Dia perfeito para atividades',
      description: `${Math.round(temperature)}°C sem chuva — ideal para caminhada, corrida ou esporte ao ar livre.`,
      priority: 'medium',
    });
  }

  // Temperatura agradável para passeio
  if (temperature >= 20 && temperature <= 28 && precipitation < 0.5 && current.isDay) {
    tips.push({
      id: 'outdoor_leisure',
      category: 'activity',
      icon: '🌳',
      title: 'Bom para passeio',
      description: 'Clima agradável para parques, feiras ou uma caminhada tranquila.',
      priority: 'low',
    });
  }

  // Frio e seco — risco de gripe
  if (temperature < 15 && humidity < 50) {
    tips.push({
      id: 'flu_risk',
      category: 'health',
      icon: '🤧',
      title: 'Risco de resfriado',
      description: 'Frio e ar seco favorecem vírus respiratórios. Evite locais fechados e mantenha-se agasalhado.',
      priority: 'medium',
    });
  }

  // Ordenar por prioridade
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return tips.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

/**
 * Retorna o índice de conforto térmico (0-100)
 */
export function getComfortIndex(temp: number, humidity: number): number {
  // Heat index simplificado
  if (temp < 15) return Math.max(0, Math.round((temp / 15) * 50));
  if (temp > 35) return Math.max(0, Math.round(100 - ((temp - 35) * 5)));

  const humidityPenalty = humidity > 70 ? (humidity - 70) * 0.5 : 0;
  const tempScore = 100 - Math.abs(temp - 22) * 4;
  return Math.max(0, Math.min(100, Math.round(tempScore - humidityPenalty)));
}

/**
 * Filtra as próximas 24h do forecast horário
 */
export function getNext24Hours(
  hourly: { time: string; [key: string]: unknown }[]
): typeof hourly {
  const now = new Date();
  const cutoff = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return hourly.filter((h) => {
    const t = new Date(h.time);
    return t >= now && t <= cutoff;
  });
}

/**
 * Determina se está de noite com base em sunrise/sunset
 */
export function isNightTime(sunrise: string, sunset: string): boolean {
  const now = new Date();
  const rise = new Date(sunrise);
  const set = new Date(sunset);
  return now < rise || now > set;
}

/**
 * Calcula percentual do dia já passado (para arco solar)
 */
export function getDayProgress(sunrise: string, sunset: string): number {
  const now = new Date().getTime();
  const rise = new Date(sunrise).getTime();
  const set = new Date(sunset).getTime();

  if (now <= rise) return 0;
  if (now >= set) return 100;

  return Math.round(((now - rise) / (set - rise)) * 100);
}

/**
 * Agrupa dicas por categoria
 */
export function groupTipsByCategory(tips: SmartTip[]): Record<string, SmartTip[]> {
  return tips.reduce(
    (acc, tip) => {
      if (!acc[tip.category]) acc[tip.category] = [];
      acc[tip.category].push(tip);
      return acc;
    },
    {} as Record<string, SmartTip[]>
  );
}

/**
 * Retorna label da categoria de dica
 */
export function getTipCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    clothing: 'Vestuário',
    health: 'Saúde',
    activity: 'Atividades',
    alert: 'Alertas',
  };
  return labels[category] ?? category;
}

/**
 * Calcula média de temperatura da semana
 */
export function getWeeklyAverageTemp(daily: DailyForecast[]): number {
  const avg = daily.reduce((sum, d) => sum + (d.tempMax + d.tempMin) / 2, 0) / daily.length;
  return Math.round(avg);
}
