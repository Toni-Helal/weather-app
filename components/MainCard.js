import styles from "./MainCard.module.css";
import { getWeatherIcon } from "../utils/weatherIconMap";

export function MainCard({
  city,
  temperature,
  feelsLike,
  windSpeed,
  weatherCode,
  time,
  sunrise,
  sunset
}) {
  const icon = getWeatherIcon(weatherCode, time, sunrise, sunset);

  return (
    <div className={styles.card}>
      <h2 className={styles.city}>{city}</h2>

      <img src={icon} alt="weather icon" className={styles.icon} />

      <h1 className={styles.temp}>{Math.round(temperature)}°C</h1>
          <p className={styles.feelsLike}>
            Feels like {Math.round(feelsLike)}°C
          </p>
    </div>
  );
}

