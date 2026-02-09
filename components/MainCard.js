import Image from "next/image"
import styles from "./MainCard.module.css"
import { getWeatherIcon } from "../utils/weatherIconMap"

export function MainCard({ data, unitSystem }) {
  if (!data) return null

  const isNumber = (value) =>
    typeof value === "number" && Number.isFinite(value)

  const {
    city,
    temperature_c,
    feels_like_c,
    sunrise,
    sunset,
  } = data

  // === Temperature ===
  const tempC = isNumber(temperature_c) ? temperature_c : null
  const tempF = tempC === null ? null : Math.round(tempC * 9 / 5 + 32)

  const feelsLikeC = isNumber(feels_like_c) ? feels_like_c : null
  const feelsLikeF = feelsLikeC === null
    ? null
    : Math.round(feelsLikeC * 9 / 5 + 32)

  const temperature = tempC === null
    ? "—"
    : unitSystem === "metric"
      ? `${tempC}°C`
      : `${tempF}°F`

  const feelsLike = feelsLikeC === null
    ? null
    : unitSystem === "metric"
      ? `${feelsLikeC}°C`
      : `${feelsLikeF}°F`

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
      {feelsLike && (
        <p className={styles.feelsLike}>
          Feels like {feelsLike}
        </p>
      )}
    </div>
  )
}
