import { afterEach, describe, expect, it, vi } from 'vitest';
import { SingaporeWeatherClient } from './weather.js';

const LATITUDE = 1.3521;
const LONGITUDE = 103.8198;

function jsonResponse(body: unknown, init: { ok?: boolean; status?: number } = {}) {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: async () => body,
  } as Response;
}

function twoHrForecastPayload() {
  return {
    code: 0,
    data: {
      area_metadata: [{ name: 'Bishan', label_location: { latitude: 1.3521, longitude: 103.8198 } }],
      items: [
        {
          update_timestamp: '2026-05-04T00:00:00+08:00',
          valid_period: { text: '11 am to 1 pm' },
          forecasts: [{ area: 'Bishan', forecast: 'Cloudy' }],
        },
      ],
    },
  };
}

function readingPayload(value: number) {
  return {
    code: 0,
    data: {
      stations: [{ id: 'S109', name: 'Ang Mo Kio', location: { latitude: 1.3521, longitude: 103.8198 } }],
      readings: [{ timestamp: '2026-05-04T00:00:00+08:00', data: [{ stationId: 'S109', value }] }],
    },
  };
}

function uvPayload() {
  return {
    code: 0,
    data: {
      records: [
        {
          updatedTimestamp: '2026-05-04T00:00:00+08:00',
          index: [{ hour: '13', value: 8 }],
        },
      ],
    },
  };
}

function airQualityPayload(readingKey: 'psi_twenty_four_hourly' | 'pm25_one_hourly', value: number) {
  return {
    code: 0,
    data: {
      regionMetadata: [{ name: 'central', labelLocation: { latitude: 1.3521, longitude: 103.8198 } }],
      items: [
        {
          updatedTimestamp: '2026-05-04T00:00:00+08:00',
          readings: { [readingKey]: { central: value } },
        },
      ],
    },
  };
}

function twentyFourHourPayload() {
  return {
    code: 0,
    data: {
      records: [
        {
          updatedTimestamp: '2026-05-04T00:00:00+08:00',
          general: { temperature: { low: 25, high: 32 } },
          periods: [
            {
              timePeriod: { text: '1 am to 1 pm' },
              regions: { central: { text: 'Cloudy' } },
            },
          ],
        },
      ],
    },
  };
}

function fourDayForecastPayload() {
  return {
    items: [
      {
        update_timestamp: '2026-05-04T00:00:00+08:00',
        forecasts: [
          { date: '2026-05-04', forecast: 'Thundery Showers', temperature: { low: 24, high: 31 } },
          { date: '2026-05-05', forecast: 'Cloudy', temperature: { low: 25, high: 32 } },
        ],
      },
    ],
  };
}

describe('SingaporeWeatherClient.getCurrentWeather', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('merges the two-hr-forecast, station readings, uv, and twenty-four-hr-forecast endpoints', async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes('two-hr-forecast')) return jsonResponse(twoHrForecastPayload());
      if (url.includes('air-temperature')) return jsonResponse(readingPayload(29.4));
      if (url.includes('relative-humidity')) return jsonResponse(readingPayload(80));
      if (url.includes('rainfall')) return jsonResponse(readingPayload(1.2));
      if (url.includes('wind-speed')) return jsonResponse(readingPayload(4.5));
      if (url.includes('wind-direction')) return jsonResponse(readingPayload(180));
      if (url.includes('/uv')) return jsonResponse(uvPayload());
      if (url.includes('/psi')) return jsonResponse(airQualityPayload('psi_twenty_four_hourly', 55));
      if (url.includes('/pm25')) return jsonResponse(airQualityPayload('pm25_one_hourly', 12));
      if (url.includes('twenty-four-hr-forecast')) return jsonResponse(twentyFourHourPayload());
      if (url.includes('4-day-weather-forecast')) return jsonResponse(fourDayForecastPayload());
      throw new Error(`unexpected url ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    const client = new SingaporeWeatherClient();
    const snapshot = await client.getCurrentWeather(LATITUDE, LONGITUDE);

    expect(snapshot).toMatchObject({
      area: 'Bishan',
      condition: 'Cloudy',
      temperature_c: 29.4,
      humidity_percent: 80,
      rainfall_mm: 1.2,
      wind_speed_knots: 4.5,
      wind_direction_degrees: 180,
      uv_index: 8,
      psi_twenty_four_hourly: 55,
      pm25_one_hourly: 12,
      air_quality_region: 'central',
      forecast_low_c: 25,
      forecast_high_c: 32,
    });
    expect(snapshot.forecast_periods).toEqual([{ label: '1 am to 1 pm', forecast: 'Cloudy' }]);
    expect(snapshot.daily_forecast).toEqual([
      { date: '2026-05-04', forecast: 'Thundery Showers', temperature_low_c: 24, temperature_high_c: 31 },
      { date: '2026-05-05', forecast: 'Cloudy', temperature_low_c: 25, temperature_high_c: 32 },
    ]);
  });

  it('falls back to nulls for endpoints that fail without losing the others', async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes('two-hr-forecast')) return jsonResponse(twoHrForecastPayload());
      if (url.includes('air-temperature')) return jsonResponse({}, { ok: false, status: 500 });
      if (url.includes('relative-humidity')) return jsonResponse(readingPayload(80));
      if (url.includes('rainfall')) return jsonResponse(readingPayload(1.2));
      if (url.includes('wind-speed')) return jsonResponse(readingPayload(4.5));
      if (url.includes('wind-direction')) return jsonResponse(readingPayload(180));
      if (url.includes('/uv')) return jsonResponse({}, { ok: false, status: 500 });
      if (url.includes('/psi')) return jsonResponse({}, { ok: false, status: 500 });
      if (url.includes('/pm25')) return jsonResponse(airQualityPayload('pm25_one_hourly', 12));
      if (url.includes('twenty-four-hr-forecast')) return jsonResponse(twentyFourHourPayload());
      if (url.includes('4-day-weather-forecast')) return jsonResponse({}, { ok: false, status: 500 });
      throw new Error(`unexpected url ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    const client = new SingaporeWeatherClient();
    const snapshot = await client.getCurrentWeather(LATITUDE, LONGITUDE);

    expect(snapshot.condition).toBe('Cloudy');
    expect(snapshot.temperature_c).toBeNull();
    expect(snapshot.uv_index).toBeNull();
    expect(snapshot.humidity_percent).toBe(80);
    expect(snapshot.rainfall_mm).toBe(1.2);
    expect(snapshot.wind_speed_knots).toBe(4.5);
    expect(snapshot.wind_direction_degrees).toBe(180);
    expect(snapshot.forecast_high_c).toBe(32);
    expect(snapshot.forecast_low_c).toBe(25);
    expect(snapshot.psi_twenty_four_hourly).toBeNull();
    expect(snapshot.pm25_one_hourly).toBeNull();
    expect(snapshot.daily_forecast).toEqual([]);
  });

  it('retries a rate-limited (429) endpoint before giving up', async () => {
    let airTemperatureAttempts = 0;
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes('two-hr-forecast')) return jsonResponse(twoHrForecastPayload());
      if (url.includes('air-temperature')) {
        airTemperatureAttempts += 1;
        if (airTemperatureAttempts < 2) return jsonResponse({}, { ok: false, status: 429 });
        return jsonResponse(readingPayload(29.4));
      }
      if (url.includes('relative-humidity')) return jsonResponse(readingPayload(80));
      if (url.includes('rainfall')) return jsonResponse(readingPayload(1.2));
      if (url.includes('wind-speed')) return jsonResponse(readingPayload(4.5));
      if (url.includes('wind-direction')) return jsonResponse(readingPayload(180));
      if (url.includes('/uv')) return jsonResponse(uvPayload());
      if (url.includes('/psi')) return jsonResponse(airQualityPayload('psi_twenty_four_hourly', 55));
      if (url.includes('/pm25')) return jsonResponse(airQualityPayload('pm25_one_hourly', 12));
      if (url.includes('twenty-four-hr-forecast')) return jsonResponse(twentyFourHourPayload());
      if (url.includes('4-day-weather-forecast')) return jsonResponse(fourDayForecastPayload());
      throw new Error(`unexpected url ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    const client = new SingaporeWeatherClient();
    const snapshot = await client.getCurrentWeather(LATITUDE, LONGITUDE);

    expect(airTemperatureAttempts).toBe(2);
    expect(snapshot.temperature_c).toBe(29.4);
  });
});
