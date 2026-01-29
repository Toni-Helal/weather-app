//
//  WeatherScreen
//  
//
//  Created by Antoun Helal on 29/01/2026.
//

import { useEffect, useState } from 'react'
import WeatherView from './WeatherView'


export default function WeatherScreen() {
  const [unitSystem, setUnitSystem] =
    useState<'metric' | 'imperial'>('metric')

  useEffect(() => {
    const id = setInterval(() => {
      setUnitSystem(u => (u === 'metric' ? 'imperial' : 'metric'))
    }, 10000)

    return () => clearInterval(id)
  }, [])

    return <WeatherView unitSystem={unitSystem} data={data} />
}
