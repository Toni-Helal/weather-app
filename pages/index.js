import { useState, useEffect } from "react";
import { MainCard } from "../components/MainCard";
import { ContentBox } from "../components/ContentBox";
import { DateAndTime } from "../components/DateAndTime";


export default function Home() {
  const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        const res = await fetch("/api/data");
        const data = await res.json();
        setWeatherData(data);
      };

      fetchData();

      const interval = setInterval(fetchData, 60 * 60 * 1000);

      return () => clearInterval(interval);
    }, []);



  if (!weatherData) {
    return <p>Loading...</p>;
  }

    return (
      <ContentBox>
        <MainCard
          temperature={weatherData.temperature}
          windSpeed={weatherData.windSpeed}
        />
        <DateAndTime time={weatherData.time} />
      </ContentBox>
    );
}
