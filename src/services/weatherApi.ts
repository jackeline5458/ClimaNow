// ============================================================
// weatherApi.ts — integração com Open-Meteo
// ============================================================

import { API_URLS, WEATHER_PARAMS } from '@/lib/constants';
import { getWeatherDescription } from '@/utils/weatherHelpers';
import type {
  WeatherData,
  Location,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  OpenMeteoResponse,
} from '@/types/weather.types';

/**
 * Busca dados completos de clima para coordenadas dadas
 */
export async function fetchWeatherData(
  lat: number,
  lon: number,
  location: Location
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: WEATHER_PARAMS.current,
    hourly: WEATHER_PARAMS.hourly,
    daily: WEATHER_PARAMS.daily,
    wind_speed_unit: WEATHER_PARAMS.wind_speed_unit,
    forecast_days: WEATHER_PARAMS.forecast_days.toString(),
    timezone: WEATHER_PARAMS.timezone,
  });

  const url = `${API_URLS.WEATHER}?${params}`;

  const res = await fetch(url, {
    next: { revalidate: 600 }, // cache 10 min (Next.js)
  });

  if (!res.ok) {
    throw new Error(`Erro ao buscar clima: ${res.status} ${res.statusText}`);
  }

  const raw: OpenMeteoResponse = await res.json();
  return transformWeatherData(raw, location);
}

/**
 * Transforma a resposta raw da API em nosso formato interno
 */
function transformWeatherData(raw: OpenMeteoResponse, location: Location): WeatherData {
  const current = transformCurrent(raw);
  const hourly = transformHourly(raw);
  const daily = transformDaily(raw);

  return {
    location,
    current,
    hourly,
    daily,
    updatedAt: new Date().toISOString(),
  };
}

function transformCurrent(raw: OpenMeteoResponse): CurrentWeather {
  const c = raw.current;
  const daily = raw.daily;

  return {
    temperature: c.temperature_2m,
    feelsLike: c.apparent_temperature,
    tempMin: daily.temperature_2m_min[0],
    tempMax: daily.temperature_2m_max[0],
    humidity: c.relative_humidity_2m,
    windSpeed: c.wind_speed_10m,
    windDirection: c.wind_direction_10m,
    uvIndex: c.uv_index,
    pressure: c.surface_pressure,
    sunrise: daily.sunrise[0],
    sunset: daily.sunset[0],
    weatherCode: c.weather_code,
    description: getWeatherDescription(c.weather_code),
    isDay: c.is_day === 1,
    precipitation: c.precipitation,
    cloudCover: c.cloud_cover,
    visibility: c.visibility,
  };
}

function transformHourly(raw: OpenMeteoResponse): HourlyForecast[] {
  const h = raw.hourly;
  return h.time.map((time, i) => ({
    time,
    temperature: h.temperature_2m[i],
    weatherCode: h.weather_code[i],
    precipitation: h.precipitation[i],
    precipitationProbability: h.precipitation_probability[i] ?? 0,
    windSpeed: h.wind_speed_10m[i],
    isDay: h.is_day[i] === 1,
  }));
}

function transformDaily(raw: OpenMeteoResponse): DailyForecast[] {
  const d = raw.daily;
  return d.time.map((date, i) => ({
    date,
    tempMax: d.temperature_2m_max[i],
    tempMin: d.temperature_2m_min[i],
    weatherCode: d.weather_code[i],
    sunrise: d.sunrise[i],
    sunset: d.sunset[i],
    precipitationSum: d.precipitation_sum[i],
    precipitationProbability: d.precipitation_probability_max[i] ?? 0,
    windSpeedMax: d.wind_speed_10m_max[i],
    uvIndexMax: d.uv_index_max[i],
  }));
}
