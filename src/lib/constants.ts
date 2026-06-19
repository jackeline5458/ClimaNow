// ============================================================
// constants.ts — constantes globais do projeto
// ============================================================

/** URLs base das APIs */
export const API_URLS = {
  WEATHER: 'https://api.open-meteo.com/v1/forecast',
  GEOCODING: 'https://geocoding-api.open-meteo.com/v1/search',
} as const;

/** Parâmetros padrão da requisição de clima */
export const WEATHER_PARAMS = {
  current: [
    'temperature_2m',
    'apparent_temperature',
    'relative_humidity_2m',
    'wind_speed_10m',
    'wind_direction_10m',
    'surface_pressure',
    'weather_code',
    'is_day',
    'precipitation',
    'cloud_cover',
    'visibility',
    'uv_index',
  ].join(','),
  hourly: [
    'temperature_2m',
    'weather_code',
    'precipitation',
    'precipitation_probability',
    'wind_speed_10m',
    'is_day',
  ].join(','),
  daily: [
    'temperature_2m_max',
    'temperature_2m_min',
    'weather_code',
    'sunrise',
    'sunset',
    'precipitation_sum',
    'precipitation_probability_max',
    'wind_speed_10m_max',
    'uv_index_max',
  ].join(','),
  wind_speed_unit: 'kmh',
  forecast_days: 7,
  timezone: 'auto',
} as const;

/** Mapeamento de WMO codes → descrição + ícone */
export const WEATHER_CODES: Record<number, { description: string; icon: string; iconNight?: string }> = {
  0:  { description: 'Céu limpo',           icon: '☀️', iconNight: '🌙' },
  1:  { description: 'Principalmente limpo', icon: '🌤️', iconNight: '🌙' },
  2:  { description: 'Parcialmente nublado', icon: '⛅', iconNight: '🌤️' },
  3:  { description: 'Nublado',              icon: '☁️' },
  45: { description: 'Névoa',                icon: '🌫️' },
  48: { description: 'Geada',                icon: '🌫️' },
  51: { description: 'Garoa leve',           icon: '🌦️' },
  53: { description: 'Garoa moderada',       icon: '🌦️' },
  55: { description: 'Garoa intensa',        icon: '🌧️' },
  61: { description: 'Chuva leve',           icon: '🌧️' },
  63: { description: 'Chuva moderada',       icon: '🌧️' },
  65: { description: 'Chuva forte',          icon: '🌧️' },
  71: { description: 'Neve leve',            icon: '🌨️' },
  73: { description: 'Neve moderada',        icon: '❄️' },
  75: { description: 'Neve forte',           icon: '❄️' },
  77: { description: 'Granizo',              icon: '🌨️' },
  80: { description: 'Pancadas de chuva',    icon: '🌦️' },
  81: { description: 'Chuva com pancadas',   icon: '🌧️' },
  82: { description: 'Chuva torrencial',     icon: '⛈️' },
  85: { description: 'Neve com vento',       icon: '🌨️' },
  86: { description: 'Nevasca',              icon: '❄️' },
  95: { description: 'Tempestade',           icon: '⛈️' },
  96: { description: 'Tempestade com granizo', icon: '⛈️' },
  99: { description: 'Tempestade severa',    icon: '🌩️' },
};

/** Gradientes de fundo por condição climática */
export const WEATHER_BACKGROUNDS: Record<string, { from: string; to: string; via?: string }> = {
  clear_day:    { from: '#1e90ff', via: '#63b3ed', to: '#90cdf4' },
  clear_night:  { from: '#0f0c29', via: '#302b63', to: '#24243e' },
  cloudy:       { from: '#4a5568', via: '#718096', to: '#a0aec0' },
  foggy:        { from: '#718096', via: '#a0aec0', to: '#cbd5e0' },
  rain:         { from: '#1a365d', via: '#2c5282', to: '#2b6cb0' },
  thunderstorm: { from: '#1a202c', via: '#2d3748', to: '#4a5568' },
  snow:         { from: '#bee3f8', via: '#90cdf4', to: '#63b3ed' },
  partly_cloudy_day:   { from: '#2b6cb0', via: '#4299e1', to: '#90cdf4' },
  partly_cloudy_night: { from: '#1a202c', via: '#2d3748', to: '#4a5568' },
  drizzle:      { from: '#2c5282', via: '#3182ce', to: '#63b3ed' },
};

/** Configurações de cache */
export const CACHE_CONFIG = {
  WEATHER_TTL: 10 * 60 * 1000,      // 10 minutos
  GEOCODING_TTL: 60 * 60 * 1000,    // 1 hora
  MAX_HISTORY_ITEMS: 10,
  MAX_FAVORITES: 20,
} as const;

/** Limites para dicas inteligentes */
export const TIP_THRESHOLDS = {
  HIGH_TEMP: 30,
  LOW_TEMP: 10,
  COLD_TEMP: 5,
  HIGH_UV: 8,
  MODERATE_UV: 6,
  LOW_HUMIDITY: 30,
  HIGH_HUMIDITY: 80,
  RAIN_THRESHOLD: 5,
  HIGH_WIND: 50,
  MODERATE_WIND: 30,
  PLEASANT_TEMP_MIN: 18,
  PLEASANT_TEMP_MAX: 25,
} as const;

/** Direções do vento */
export const WIND_DIRECTIONS = [
  'N', 'NNE', 'NE', 'ENE',
  'E', 'ESE', 'SE', 'SSE',
  'S', 'SSO', 'SO', 'OSO',
  'O', 'ONO', 'NO', 'NNO',
] as const;

/** Chaves do localStorage */
export const STORAGE_KEYS = {
  FAVORITES: 'climanow:favorites',
  HISTORY: 'climanow:history',
  LAST_LOCATION: 'climanow:last_location',
  THEME: 'climanow:theme',
  UNIT: 'climanow:unit',
} as const;
