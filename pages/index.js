import { useState, useEffect } from "react";
import { ContentBox } from "../components/ContentBox";
import { MainCard } from "../components/MainCard";
import { DateAndTime } from "../components/DateAndTime";
import { MetricsBox } from "../components/MetricsBox";
import styles from "../styles/Home.module.css";
import { getWeatherTheme } from "../utils/weatherMap";

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/data");
      const data = await res.json();
      setWeatherData(data);
    };

    fetchData();
    const interval = setInterval(fetchData, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!weatherData) {
    return <p>Loading...</p>;
  }

  const theme = getWeatherTheme(
    weatherData.weatherCode,
    weatherData.time,
    weatherData.sunrise,
    weatherData.sunset
  );

  return (
    <div className={styles[theme] || styles["default-day"]}>
      <ContentBox>
        <MainCard
          city={weatherData.city}
          temperature={weatherData.temperature}
          feelsLike={weatherData.feelsLike}
          windSpeed={weatherData.windSpeed}
          windDirection={weatherData.windDirection}
          weatherCode={weatherData.weatherCode}
          time={weatherData.time}
          sunrise={weatherData.sunrise}
          sunset={weatherData.sunset}
        />

        <DateAndTime
          time={weatherData.time}
        />

        <MetricsBox
          windSpeed={weatherData.windSpeed}
          windDirection={weatherData.windDirection}
          sunrise={weatherData.sunrise}
          sunset={weatherData.sunset}
          humidity={weatherData.humidity}
          visibility={weatherData.visibility}
        />
      </ContentBox>
    </div>
  );
}

