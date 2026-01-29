//
//  weatherIconMap.js
//  
//
//  Created by Antoun Helal on 29/01/2026.
//

export function getWeatherIcon(code, time, sunrise, sunset) {
  const now = new Date(time);
  const rise = new Date(sunrise);
  const set = new Date(sunset);

  const isDay = now >= rise && now <= set;

  const suffix = isDay ? "d" : "n";

  if (code === 0) return `/icons/01${suffix}.svg`; // clear
  if ([1, 2, 3].includes(code)) return `/icons/04${suffix}.svg`; // cloudy
  if ([45, 48].includes(code)) return `/icons/50${suffix}.svg`; // fog
  if ([51, 53, 55, 61, 63, 65].includes(code)) return `/icons/09${suffix}.svg`; // rain
  if ([71, 73, 75, 85, 86].includes(code)) return `/icons/13${suffix}.svg`; // snow
  if ([95, 96, 99].includes(code)) return `/icons/11${suffix}.svg`; // thunder

  return `/icons/01${suffix}.svg`;
}
