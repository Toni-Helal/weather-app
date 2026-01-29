//
//  WeatherView.tsx
//  
//
//  Created by Antoun Helal on 29/01/2026.
//

type WeatherData = {
  city: string
  temperature_c: number
  wind_mps: number
  wind_direction: number
  humidity: number
  visibility_m: number
  sunrise: string
  sunset: string
}

type Props = {
  unitSystem: 'metric' | 'imperial'
  data: WeatherData | null
}

export default function WeatherView({ unitSystem, data }: Props) {
  if (!data) return null

  const tempC = data.temperature_c
  const windMps = data.wind_mps
  const visibilityKm = Math.round(data.visibility_m / 1000)

  const tempF = Math.round(tempC * 9 / 5 + 32)
  const windMph = Math.round(windMps * 2.237)
  const visibilityMiles = Math.round(visibilityKm * 0.621)

  const temperature =
    unitSystem === 'metric'
      ? `${tempC} °C`
      : `${tempF} °F`

  const wind =
    unitSystem === 'metric'
      ? `${windMps} m/s`
      : `${windMph} mph`

  const visibility =
    unitSystem === 'metric'
      ? `${visibilityKm} km`
      : `${visibilityMiles} mi`

  return (
    <div>
      <h1>{temperature}</h1>
      <div>Wind: {wind}</div>
      <div>Visibility: {visibility}</div>
      <div>Humidity: {data.humidity}%</div>
    </div>
  )
}
