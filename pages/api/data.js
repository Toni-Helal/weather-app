import fs from "fs"
import path from "path"

export default async function handler(req, res) {
  try {
    // === 1. Load location config ===
    const filePath = path.join(process.cwd(), "config/location.json")
    const fileData = fs.readFileSync(filePath, "utf8")
    const { latitude, longitude, city } = JSON.parse(fileData)

    // === 2. Build Open-Meteo URL (metric only) ===
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      "&current_weather=true" +
      "&hourly=relativehumidity_2m,visibility" +
      "&daily=sunrise,sunset" +
      "&forecast_days=1" +
      "&timezone=auto"

    // === 3. Fetch weather data ===
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error("Weather API request failed")
    }

    const apiData = await response.json()

    // === 4. Normalize and return data ===
    res.status(200).json({
      city,

      // temperature (metric base)
      temperature_c: apiData.current_weather.temperature,

      // wind (metric base)
      wind_mps: apiData.current_weather.windspeed,
      wind_direction: apiData.current_weather.winddirection,

      // humidity (%)
      humidity: apiData.hourly.relativehumidity_2m[0],

      // visibility (meters)
      visibility_m: apiData.hourly.visibility[0],

      // dates (ISO strings)
      sunrise: apiData.daily.sunrise[0],
      sunset: apiData.daily.sunset[0],
    })
  } catch (error) {
    res.status(500).json({
      error: "Failed to load weather data",
    })
  }
}
