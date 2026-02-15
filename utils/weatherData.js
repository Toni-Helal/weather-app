import fs from "fs"
import path from "path"

function toNumberOrNull(value) {
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

export async function fetchWeatherData() {
  const filePath = path.join(process.cwd(), "config/location.json")
  const fileData = fs.readFileSync(filePath, "utf8")
  const { latitude, longitude, city } = JSON.parse(fileData)

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      "temperature_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,weather_code,relative_humidity_2m,visibility",
    hourly: "relative_humidity_2m,relativehumidity_2m,visibility,apparent_temperature",
    daily: "sunrise,sunset",
    forecast_days: "1",
    timezone: "auto",
    wind_speed_unit: "ms",
  })

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`

  const fetchFn =
    typeof fetch === "function"
      ? fetch
      : (await import("node-fetch")).default

  const controller =
    typeof AbortController === "function"
      ? new AbortController()
      : null

  const timeoutId = controller
    ? setTimeout(() => controller.abort(), 10000)
    : null

  let response
  try {
    response = await fetchFn(
      url,
      controller ? { signal: controller.signal } : {}
    )
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }

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

  return {
    city,
    temperature_c: temperature,
    feels_like_c: feelsLike,
    weatherCode,
    time: current.time || null,
    wind_mps: windMps,
    wind_direction: windDirection,
    humidity,
    visibility_m: toNumberOrNull(visibility),
    sunrise: daily.sunrise?.[0] || null,
    sunset: daily.sunset?.[0] || null,
  }
}
