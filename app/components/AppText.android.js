import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../config/colors'

export default function AppText({ children }) {
  return (
    <View>
      <Text style={styles.text}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({

    text: {
        color: colors.dark,
        fontSize: 18,
        fontFamily: "Roboto"
    },
})