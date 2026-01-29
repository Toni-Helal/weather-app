//
//  AutoTabs.tsx
//  
//
//  Created by Antoun Helal on 29/01/2026.
//

import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { TabButton } from './TabButton'

const TABS = ['Today', 'Hourly', 'Weekly']
const INTERVAL_MS = 4000

export function AutoTabs() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex(i => (i + 1) % TABS.length)
    }, INTERVAL_MS)

    return () => clearInterval(id)
  }, [])

  return (
    <View style={styles.container}>
      {TABS.map((label, index) => (
        <TabButton
          key={label}
          label={label}
          active={index === activeIndex}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
})
