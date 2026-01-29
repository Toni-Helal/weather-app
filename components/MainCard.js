import styles from "./MainCard.module.css";
import { getWeatherIcon } from "../utils/weatherIconMap";

export function MainCard({ city, temperature, windSpeed, weatherCode }) {
  const icon = getWeatherIcon(weatherCode);

  return (
    <div className={styles.card}>
      <h2>{city}</h2>

      <img
        src={icon}
        alt="weather icon"
        className={styles.icon}
      />

      <h1>{Math.round(temperature)}°C</h1>
      <p>Wind: {Math.round(windSpeed)} km/h</p>
    </div>
  );
}

