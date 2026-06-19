// ============================================================
// weather.types.ts — todas as interfaces e tipos do projeto
// ============================================================

/** Coordenadas geográficas */
export interface Coordinates {
  lat: number;
  lon: number;
}

/** Resultado da geocodificação */
export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string; // estado/província
  admin2?: string;
  population?: number;
  timezone?: string;
}

/** Dados do clima atual */
export interface CurrentWeather {
  temperature: number;           // °C
  feelsLike: number;            // sensação térmica °C
  tempMin: number;              // mínima do dia °C
  tempMax: number;              // máxima do dia °C
  humidity: number;             // %
  windSpeed: number;            // km/h
  windDirection: number;        // graus
  uvIndex: number;              // 0-11+
  pressure: number;             // hPa
  sunrise: string;              // ISO timestamp
  sunset: string;               // ISO timestamp
  weatherCode: number;          // WMO code
  description: string;
  isDay: boolean;
  precipitation: number;        // mm/h
  cloudCover: number;           // %
  visibility: number;           // km
}

/** Previsão horária */
export interface HourlyForecast {
  time: string;                 // ISO timestamp
  temperature: number;
  weatherCode: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
  isDay: boolean;
}

/** Previsão diária */
export interface DailyForecast {
  date: string;                 // YYYY-MM-DD
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  sunrise: string;
  sunset: string;
  precipitationSum: number;
  precipitationProbability: number;
  windSpeedMax: number;
  uvIndexMax: number;
}

/** Dados completos de clima para uma localização */
export interface WeatherData {
  location: Location;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  updatedAt: string;
}

/** Localização com nome e coordenadas */
export interface Location {
  name: string;
  country: string;
  countryCode: string;
  region?: string;
  lat: number;
  lon: number;
  timezone?: string;
}

/** Cidade salva nos favoritos */
export interface FavoriteCity {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region?: string;
  lat: number;
  lon: number;
  addedAt: string;
}

/** Item do histórico de busca */
export interface SearchHistory {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region?: string;
  lat: number;
  lon: number;
  searchedAt: string;
}

/** Dica inteligente */
export interface SmartTip {
  id: string;
  category: 'clothing' | 'health' | 'activity' | 'alert';
  icon: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

/** Estado do store de clima */
export interface WeatherStore {
  currentLocation: Location | null;
  weatherData: WeatherData | null;
  favorites: FavoriteCity[];
  searchHistory: SearchHistory[];
  isLoading: boolean;
  error: string | null;

  setLocation: (location: Location) => void;
  setWeatherData: (data: WeatherData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addFavorite: (city: FavoriteCity) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (lat: number, lon: number) => boolean;
  addToHistory: (item: Omit<SearchHistory, 'id' | 'searchedAt'>) => void;
  clearHistory: () => void;
}

/** Estado do store de UI */
export interface UIStore {
  theme: 'light' | 'dark' | 'system';
  unit: 'celsius' | 'fahrenheit';
  activeTab: 'current' | 'hourly' | 'weekly';

  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleUnit: () => void;
  setActiveTab: (tab: 'current' | 'hourly' | 'weekly') => void;
}

/** WMO Weather Interpretation Codes */
export type WeatherCode =
  | 0   // Clear sky
  | 1 | 2 | 3   // Mainly clear, partly cloudy, overcast
  | 45 | 48      // Fog
  | 51 | 53 | 55 // Drizzle
  | 61 | 63 | 65 // Rain
  | 71 | 73 | 75 // Snow
  | 77           // Snow grains
  | 80 | 81 | 82 // Rain showers
  | 85 | 86      // Snow showers
  | 95           // Thunderstorm
  | 96 | 99;     // Thunderstorm with hail

/** Resposta raw da API Open-Meteo */
export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    surface_pressure: number;
    weather_code: number;
    is_day: number;
    precipitation: number;
    cloud_cover: number;
    visibility: number;
    uv_index: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation: number[];
    precipitation_probability: number[];
    wind_speed_10m: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    uv_index_max: number[];
  };
}
