import { useState, useEffect } from "react";
import { MainCard } from "../components/MainCard";
import { ContentBox } from "../components/ContentBox";


export default function Home() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/data");
      const data = await res.json();
      setWeatherData(data);
    };

    fetchData();
  }, []);

  if (!weatherData) {
    return <p>Loading...</p>;
  }

    return (
      <ContentBox>
        <MainCard
          temperature={weatherData.temperature}
          windSpeed={weatherData.windSpeed}
          time={weatherData.time}
        />
      </ContentBox>
    );
}
