//
//  weatherMap.js
//  
//
//  Created by Antoun Helal on 29/01/2026.
//

export function getWeatherTheme(code, time, sunrise, sunset) {
  const now = new Date(time);
  const rise = new Date(sunrise);
  const set = new Date(sunset);

  const isDay = now >= rise && now <= set;
  const suffix = isDay ? "day" : "night";

  if (code === 0) return `clear-${suffix}`;
  if ([1, 2, 3].includes(code)) return `cloudy-${suffix}`;
  if ([45, 48].includes(code)) return `fog-${suffix}`;
  if ([51, 53, 55, 61, 63, 65].includes(code)) return `rain-${suffix}`;
  if ([71, 73, 75, 85, 86].includes(code)) return `snow-${suffix}`;

  return `default-${suffix}`;
}

