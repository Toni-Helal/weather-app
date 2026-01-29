import { useState, useEffect } from "react"
import { ContentBox } from "../components/ContentBox"
import { MainCard } from "../components/MainCard"
import { DateAndTime } from "../components/DateAndTime"
import { MetricsBox } from "../components/MetricsBox"
import styles from "../styles/Home.module.css"
import { getWeatherTheme } from "../utils/weatherMap"

export default function Home() {
  // === 1. Weather data ===
  const [weatherData, setWeatherData] = useState(null)

  // === 2. Unit system (single source of truth) ===
  const [unitSystem, setUnitSystem] = useState("metric")

  // === 3. Auto-switch unit system every 10s ===
  useEffect(() => {
    const id = setInterval(() => {
      setUnitSystem(u => (u === "metric" ? "imperial" : "metric"))
    }, 10000)

    return () => clearInterval(id)
  }, [])

  // === 4. Fetch weather data ===
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/data")
      const data = await res.json()
      setWeatherData(data)
    }

    fetchData()
    const interval = setInterval(fetchData, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (!weatherData) {
    return <p>Loading...</p>
  }

  // === 5. Theme ===
  const theme = getWeatherTheme(
    weatherData.weatherCode,
    weatherData.time,
    weatherData.sunrise,
    weatherData.sunset
  )

  return (
    <div className={styles[theme] || styles["default-day"]}>
      <ContentBox>
        <div className={styles.left}>
          <MainCard
            data={weatherData}
            unitSystem={unitSystem}
          />
        </div>

        <div className={styles.right}>
          <DateAndTime />

          <MetricsBox
            data={weatherData}
            unitSystem={unitSystem}
          />
        </div>
      </ContentBox>
    </div>
  )
}
