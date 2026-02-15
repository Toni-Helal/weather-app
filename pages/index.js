import { useState, useEffect } from "react"
import { ContentBox } from "../components/ContentBox"
import { MainCard } from "../components/MainCard"
import { DateAndTime } from "../components/DateAndTime"
import { MetricsBox } from "../components/MetricsBox"
import styles from "../styles/Home.module.css"
import { getWeatherTheme } from "../utils/weatherMap"
import { fetchWeatherData } from "../utils/weatherData"

export default function Home({ initialWeatherData }) {
  // === 1. Weather data ===
  const [weatherData, setWeatherData] = useState(initialWeatherData || null)
  const [errorMessage, setErrorMessage] = useState("")

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
    if (initialWeatherData) return

    const fetchData = async () => {
      try {
        const res = await fetch("/api/data")
        const data = await res.json()

        if (!res.ok || data?.error) {
          throw new Error(data?.error || "Invalid weather payload")
        }

        setWeatherData(data || null)
        setErrorMessage("")
      } catch (error) {
        setErrorMessage("Unable to load weather data right now.")
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [initialWeatherData])

  if (!weatherData) {
    return <p>{errorMessage || "Loading..."}</p>
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

export async function getServerSideProps() {
  try {
    const initialWeatherData = await fetchWeatherData()
    return { props: { initialWeatherData } }
  } catch (error) {
    console.error("SSR weather fetch failed", error)
    return { props: { initialWeatherData: null } }
  }
}
