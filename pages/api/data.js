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
      
      const humidity =
        data.hourly?.relativehumidity_2m?.[0] ?? null;
      const visibility =
        data.hourly?.visibility?.[0] ?? null;

      const windDirection = data.current_weather?.winddirection ?? null;


      res.status(200).json({
        city,
        temperature: data.current_weather.temperature,
        windSpeed: data.current_weather.windspeed,
        weatherCode: data.current_weather.weathercode,
        windDirection,
        time: data.current_weather.time,
        sunrise: data.daily?.sunrise?.[0],
        sunset: data.daily?.sunset?.[0],
        humidity,
        visibility
      });

  } catch (error) {
    res.status(500).json({ error: "Failed to load weather data" });
  }
}
