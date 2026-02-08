import Image from "next/image"
import styles from "./MainCard.module.css"
import { getWeatherIcon } from "../utils/weatherIconMap"

export function MainCard({ data, unitSystem }) {
  if (!data) return null

  const {
    city,
    temperature_c,
    sunrise,
    sunset,
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

      <Image
        src={icon}
        alt="weather icon"
        width={180}
        height={180}
        className={styles.icon}
      />

      <h1>{temperature}</h1>
    </div>
  )
}
