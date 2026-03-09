import { StyleSheet, View} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react'
import Constants from 'expo-constants'

export default function Screen({ children, style }) {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <View style={[styles.view, style]}>{children}</View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    screen: {
      paddingTop: Constants.statusBarHeight,
      flex: 1,
    },
    view: {
      flex: 1,
    }
})