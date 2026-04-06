import location from "../../config/location.json";

const WMO_MAP = {
  0:  { description: "clear sky",         base: "01" },
  1:  { description: "mainly clear",      base: "02" },
  2:  { description: "partly cloudy",     base: "03" },
  3:  { description: "overcast",          base: "04" },
  45: { description: "fog",               base: "50" },
  48: { description: "icy fog",           base: "50" },
  51: { description: "light drizzle",     base: "09" },
  53: { description: "drizzle",           base: "09" },
  55: { description: "heavy drizzle",     base: "09" },
  61: { description: "light rain",        base: "10" },
  63: { description: "rain",              base: "10" },
  65: { description: "heavy rain",        base: "10" },
  71: { description: "light snow",        base: "13" },
  73: { description: "snow",              base: "13" },
  75: { description: "heavy snow",        base: "13" },
  77: { description: "snow grains",       base: "13" },
  80: { description: "light showers",     base: "09" },
  81: { description: "showers",           base: "09" },
  82: { description: "heavy showers",     base: "09" },
  85: { description: "snow showers",      base: "13" },
  86: { description: "heavy snow showers",base: "13" },
  95: { description: "thunderstorm",      base: "11" },
  96: { description: "thunderstorm",      base: "11" },
  99: { description: "thunderstorm",      base: "11" },
};

function wmoToWeather(code, isDay) {
  const entry = WMO_MAP[code] || { description: "unknown", base: "01" };
  const suffix = isDay ? "d" : "n";
  return { description: entry.description, icon: `${entry.base}${suffix}` };
}

// Parse an OpenMeteo local-time string ("2024-01-01T07:30") to a UTC unix timestamp
// such that unixToLocalTime(result, utcOffsetSeconds) gives back the correct local time.
function localStringToUnix(localStr, utcOffsetSeconds) {
  return Date.parse(localStr + "Z") / 1000 - utcOffsetSeconds;
}

export default async function handler(req, res) {
  const body = req.body || {};
  const latitude  = body.lat     ?? location.latitude;
  const longitude = body.lon     ?? location.longitude;
  const city      = body.city    ?? location.city;
  const country   = body.country ?? location.country;

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&current_weather=true` +
    `&hourly=relativehumidity_2m,apparent_temperature` +
    `&daily=sunrise,sunset` +
    `&timezone=auto` +
    `&windspeed_unit=ms`;

  const response = await fetch(url);
  const data = await response.json();

  const { current_weather, hourly, daily, utc_offset_seconds } = data;

  // Find the hourly index matching the current hour
  const currentHourPrefix = current_weather.time.substring(0, 13);
  const hourlyIndex = hourly.time.findIndex((t) => t.startsWith(currentHourPrefix));
  const hi = hourlyIndex >= 0 ? hourlyIndex : 0;

  const { description, icon } = wmoToWeather(
    current_weather.weathercode,
    current_weather.is_day
  );

  const shaped = {
    name: city,
    sys: {
      country: country || "",
      sunrise: localStringToUnix(daily.sunrise[0], utc_offset_seconds),
      sunset: localStringToUnix(daily.sunset[0], utc_offset_seconds),
    },
    weather: [{ description, icon }],
    main: {
      temp: current_weather.temperature,
      feels_like: hourly.apparent_temperature[hi],
      humidity: hourly.relativehumidity_2m[hi],
    },
    wind: {
      speed: current_weather.windspeed,
      deg: current_weather.winddirection,
    },
    visibility: 10000,
    timezone: utc_offset_seconds,
    dt: localStringToUnix(current_weather.time, utc_offset_seconds),
  };

  res.status(200).json(shaped);
}
