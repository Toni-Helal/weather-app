import { MetricsCard } from "./MetricsCard"
import styles from "./MetricsBox.module.css"

function getWindDirectionLabel(deg) {
  if (typeof deg !== "number") return "—"

  const directions = [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW",
    "W", "WNW", "NW", "NNW",
  ]

  const index = Math.round(deg / 22.5) % 16
  return directions[index]
}

export function MetricsBox({ data, unitSystem }) {
  if (!data) return null

  // === Base metric values from API ===
  const windMps = data.wind_mps
  const visibilityMeters = data.visibility_m
  const humidity = data.humidity
  const windDirection = data.wind_direction

  // === Conversions ===
  const windMetric = `${Math.round(windMps)} m/s`
  const windImperial = `${Math.round(windMps * 2.237)} mph`

  const visibilityKm = Math.round(visibilityMeters / 1000)
  const visibilityMiles = Math.round(visibilityKm * 0.621)

  const visibilityMetric = `${visibilityKm} km`
  const visibilityImperial = `${visibilityMiles} mi`

  // === Dates (guarded) ===
  const sunrise = data.sunrise
    ? new Date(data.sunrise).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—"

  const sunset = data.sunset
    ? new Date(data.sunset).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—"

  return (
    <div className={styles.grid}>
      <MetricsCard
        title="Wind speed"
        value={unitSystem === "metric" ? windMetric : windImperial}
        icon="/icons/wind.png"
      />

      <MetricsCard
        title="Wind direction"
        value={getWindDirectionLabel(windDirection)}
        icon="/icons/compass.png"
      />

      <MetricsCard
        title="Sunrise"
        value={sunrise}
        icon="/icons/01d.svg"
      />

      <MetricsCard
        title="Sunset"
        value={sunset}
        icon="/icons/01n.svg"
      />

      <MetricsCard
        title="Humidity"
        value={`${humidity}%`}
        icon="/icons/humidity.png"
      />

      <MetricsCard
        title="Visibility"
        value={
          unitSystem === "metric"
            ? visibilityMetric
            : visibilityImperial
        }
        icon="/icons/binocular.png"
      />
    </div>
  )
}
