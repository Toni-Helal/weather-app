import fs from "fs"
import path from "path"

function toNumberOrNull(value) {
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

export default async function handler(req, res) {
  try {
    // === 1. Load location config ===
    const filePath = path.join(process.cwd(), "config/location.json")
    const fileData = fs.readFileSync(filePath, "utf8")
    const { latitude, longitude, city } = JSON.parse(fileData)

    // === 2. Build Open-Meteo URL (metric only) ===
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current:
        "temperature_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,weather_code,relative_humidity_2m,visibility",
      // Keep both humidity names for backward compatibility.
      hourly: "relative_humidity_2m,relativehumidity_2m,visibility,apparent_temperature",
      daily: "sunrise,sunset",
      forecast_days: "1",
      timezone: "auto",
      wind_speed_unit: "ms",
    })

    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`

    // === 3. Fetch weather data ===
    const fetchFn =
      typeof fetch === "function"
        ? fetch
        : (await import("node-fetch")).default

    const response = await fetchFn(url)
    if (!response.ok) {
      throw new Error(`Weather API request failed (${response.status})`)
    }

    const apiData = await response.json()
    const current = apiData.current || apiData.current_weather || {}
    const hourly = apiData.hourly || {}
    const daily = apiData.daily || {}

    const humidity =
      toNumberOrNull(current.relative_humidity_2m) ??
      toNumberOrNull(hourly.relative_humidity_2m?.[0]) ??
      toNumberOrNull(hourly.relativehumidity_2m?.[0])

    const visibility =
      toNumberOrNull(current.visibility) ??
      toNumberOrNull(hourly.visibility?.[0])

    const temperature =
      toNumberOrNull(current.temperature_2m) ??
      toNumberOrNull(current.temperature)

    const feelsLike =
      toNumberOrNull(current.apparent_temperature) ??
      toNumberOrNull(hourly.apparent_temperature?.[0])

    const windMps =
      toNumberOrNull(current.wind_speed_10m) ??
      toNumberOrNull(current.windspeed)

    const windDirection =
      toNumberOrNull(current.wind_direction_10m) ??
      toNumberOrNull(current.winddirection)

    const weatherCode =
      toNumberOrNull(current.weather_code) ??
      toNumberOrNull(current.weathercode)

    // === 4. Normalize and return data ===
    res.status(200).json({
      city,

      // temperature (metric base)
      temperature_c: temperature,
      feels_like_c: feelsLike,

      // weather code and time (for theme/icons)
      weatherCode,
      time: current.time || null,

      // wind (metric base)
      wind_mps: windMps,
      wind_direction: windDirection,

      // humidity (%)
      humidity,

      // visibility (meters)
      visibility_m: toNumberOrNull(visibility),

      // dates (ISO strings)
      sunrise: daily.sunrise?.[0] || null,
      sunset: daily.sunset?.[0] || null,
    })
  } catch (error) {
    console.error("Failed to load weather data", error)
    res.status(500).json({
      error: "Failed to load weather data",
    })
  }
}
