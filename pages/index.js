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
    const results = await Promise.all(
      cities.map((c) =>
        fetch("/api/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: c.latitude,
            lon: c.longitude,
            city: c.city,
            country: c.country,
          }),
        }).then((r) => r.json())
      )
    );
    const cache = {};
    results.forEach((d) => {
      cache[d.name] = d;
    });
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

  return allLoaded && weatherData && !weatherData.message ? (
    <div className={styles.wrapper}>
      <MainCard
        city={weatherData.name}
        country={weatherData.sys.country}
        description={weatherData.weather[0].description}
        iconName={weatherData.weather[0].icon}
        unitSystem={unitSystem}
        weatherData={weatherData}
      />
      <ContentBox>
        <Header>
          <DateAndTime weatherData={weatherData} unitSystem={unitSystem} />
        </Header>
        <MetricsBox weatherData={weatherData} unitSystem={unitSystem} />
        <UnitSwitch onClick={changeSystem} unitSystem={unitSystem} />
      </ContentBox>
    </div>
  ) : weatherData && weatherData.message ? (
    <ErrorScreen errorMessage="Unable to load weather data, please try again later." />
  ) : (
    <LoadingScreen loadingMessage="Loading data..." />
  );
};

export default App;
