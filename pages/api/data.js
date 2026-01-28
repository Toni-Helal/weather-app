export default async function handler(req, res) {
  try {
    // الإحداثيات ستكون لاحقًا من config
    const latitude = 48.8566;
    const longitude = 2.3522;

    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      "&current_weather=true" +
      "&timezone=auto";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Open-Meteo API error");
    }

    const data = await response.json();

    // نعيد فقط ما نحتاجه
    const result = {
      temperature: data.current_weather.temperature,
      windSpeed: data.current_weather.windspeed,
      weatherCode: data.current_weather.weathercode,
      time: data.current_weather.time,
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch weather data",
    });
  }
}
