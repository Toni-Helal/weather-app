import { useState, useEffect } from "react";

import { MainCard } from "../components/MainCard";
import { ContentBox } from "../components/ContentBox";
import { Header } from "../components/Header";
import { DateAndTime } from "../components/DateAndTime";
import { MetricsBox } from "../components/MetricsBox";
import { UnitSwitch } from "../components/UnitSwitch";
import { LoadingScreen } from "../components/LoadingScreen";
import { ErrorScreen } from "../components/ErrorScreen";

import cities from "../config/cities.json";
import styles from "../styles/Home.module.css";

export const App = () => {
  const [weatherCache, setWeatherCache] = useState({});
  const [cycleIndex, setCycleIndex] = useState(0);

  const fetchAllCities = async () => {
    const cache = {};
    for (let i = 0; i < cities.length; i++) {
      const c = cities[i];
      try {
        const r = await fetch("/api/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: c.latitude,
            lon: c.longitude,
            city: c.city,
            country: c.country,
          }),
        });
        cache[c.city] = await r.json();
      } catch {
        cache[c.city] = { city: c.city, error: true };
      }
    }
    setWeatherCache(cache);
  };

  useEffect(() => {
    fetchAllCities();
    const dataInterval = setInterval(fetchAllCities, 60 * 60 * 1000);
    const cycleInterval = setInterval(() => {
      setCycleIndex((i) => (i + 1) % (cities.length * 2));
    }, 10_000);
    return () => {
      clearInterval(dataInterval);
      clearInterval(cycleInterval);
    };
  }, []);

  const cityIndex = Math.floor(cycleIndex / 2);
  const unitSystem = cycleIndex % 2 === 0 ? "metric" : "imperial";
  const weatherData = weatherCache[cities[cityIndex].city];

  const changeSystem = () =>
    setCycleIndex((i) => {
      const base = Math.floor(i / 2) * 2;
      return i % 2 === 0 ? base + 1 : base;
    });

  const allLoaded = cities.every((c) => weatherCache[c.city]);

  return allLoaded && weatherData && !weatherData.error ? (
    <div className={styles.wrapper}>
      <MainCard data={weatherData} unitSystem={unitSystem} />
      <ContentBox>
        <Header>
          <DateAndTime />
        </Header>
        <MetricsBox data={weatherData} unitSystem={unitSystem} />
        <UnitSwitch onClick={changeSystem} unitSystem={unitSystem} />
      </ContentBox>
    </div>
  ) : weatherData && weatherData.error ? (
    <ErrorScreen errorMessage="Unable to load weather data, please try again later." />
  ) : (
    <LoadingScreen loadingMessage="Loading data..." />
  );
};

export default App;
