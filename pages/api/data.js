import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "config/location.json");
    const fileData = fs.readFileSync(filePath, "utf8");
    const location = JSON.parse(fileData);

    const { latitude, longitude, city } = location;

    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      "&current_weather=true" +
      "&hourly=relativehumidity_2m,visibility" +
      "&daily=sunrise,sunset" +
      "&forecast_days=1" +
      "&timezone=auto";

    const response = await fetch(url);
    const data = await response.json();

    const temperature = data.current_weather?.temperature ?? null;
    const windSpeed = data.current_weather?.windspeed ?? null;
    const windDirection = data.current_weather?.winddirection ?? null;

    const humidity =
      data.hourly?.relativehumidity_2m?.[0] ?? null;

    const visibility =
      data.hourly?.visibility?.[0] ?? null;

    function calculateFeelsLike(temp, wind) {
      if (temp == null || wind == null) return null;

      if (temp > 10) return temp;

      const v = Math.pow(wind, 0.16);

      return (
        13.12 +
        0.6215 * temp -
        11.37 * v +
        0.3965 * temp * v
      );
    }

    const feelsLike = calculateFeelsLike(temperature, windSpeed);

    res.status(200).json({
      city,
      temperature,
      feelsLike: feelsLike !== null ? Math.round(feelsLike) : null,
      windSpeed,
      windDirection,
      weatherCode: data.current_weather?.weathercode ?? null,
      time: data.current_weather?.time ?? null,
      sunrise: data.daily?.sunrise?.[0] ?? null,
      sunset: data.daily?.sunset?.[0] ?? null,
      humidity,
      visibility
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to load weather data" });
  }
}
