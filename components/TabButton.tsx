//
//  TabButton.tsx
//  
//
//  Created by Antoun Helal on 29/01/2026.
//

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

type Props = {
  label: string
  active: boolean
}

export function TabButton({ label, active }: Props) {
  return (
    <View style={[styles.button, active && styles.active]}>
      <Text style={[styles.text, active && styles.activeText]}>
        {label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    opacity: 0.4,
  },
  active: {
    opacity: 1,
    borderBottomWidth: 2,
  },
  text: {
    fontSize: 14,
  },
  activeText: {
    fontWeight: '600',
  },
})
