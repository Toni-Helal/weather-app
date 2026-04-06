import { fetchWeatherData } from "../../utils/weatherData"

export default async function handler(req, res) {
  try {
    const body = req.body || {}
    const data = await fetchWeatherData({
      latitude: body.lat,
      longitude: body.lon,
      city: body.city,
      country: body.country,
    })
    res.status(200).json(data)
  } catch (error) {
    console.error("Failed to load weather data", error)
    res.status(500).json({ error: "Failed to load weather data" })
  }
}
