import styles from "./MainCard.module.css"
import { getWeatherIcon } from "../utils/weatherIconMap"

export function MainCard({ data, unitSystem }) {
  if (!data) return null

  const {
    city,
    temperature_c,
    wind_mps,
    sunrise,
    sunset,
    humidity,
  } = data

  // === Temperature ===
  const tempC = temperature_c
  const tempF = Math.round(tempC * 9 / 5 + 32)

  const temperature =
    unitSystem === "metric"
      ? `${tempC}°C`
      : `${tempF}°F`

  // === Icon ===
  const icon = getWeatherIcon(
    data.weatherCode,
    data.time,
    sunrise,
    sunset
  )

  return (
    <div className={styles.card}>
      <h2 className={styles.city}>{city}</h2>

      <img
        src={icon}
        alt="weather icon"
        className={styles.icon}
      />

      <h1>{temperature}</h1>
    </div>
  )
}
