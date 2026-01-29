//
//  MetricsBox.js
//  
//
//  Created by Antoun Helal on 29/01/2026.
//

import { MetricsCard } from "./MetricsCard";
import styles from "./MetricsBox.module.css";

function getWindDirectionLabel(deg) {
  if (deg == null) return "—";

  const directions = [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW",
    "W", "WNW", "NW", "NNW"
  ];

  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

export function MetricsBox({
  windSpeed,
  windDirection,
  sunrise,
  sunset,
  humidity,
  visibility
}) {
  return (
    <div className={styles.grid}>
      <MetricsCard
        title="Wind"
        value={Math.round(windSpeed)}
        unit="km/h"
        icon="/icons/wind.png"
      />

      <MetricsCard
        title="Wind direction"
        value={getWindDirectionLabel(windDirection)}
        icon="/icons/compass.png"
      />

      <MetricsCard
        title="Sunrise"
        value={new Date(sunrise).toLocaleTimeString()}
        icon="/icons/01d.svg"
      />

      <MetricsCard
        title="Sunset"
        value={new Date(sunset).toLocaleTimeString()}
        icon="/icons/01n.svg"
      />

      <MetricsCard
        title="Humidity"
        value={humidity}
        unit="%"
        icon="/icons/humidity.png"
      />

      <MetricsCard
        title="Visibility"
        value={Math.round(visibility / 1000)}
        unit="km"
        icon="/icons/binocular.png"
      />
    </div>
  );
}

