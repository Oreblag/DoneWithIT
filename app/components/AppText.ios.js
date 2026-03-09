import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../config/colors'

export default function AppText({ children, style, ...otherProps }) {
  return (
    <View>
      <Text style={[styles.text, style]} {...otherProps}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({

    text: {
        color: colors.dark,
        fontSize: 20,
        fontFamily: "Avenir"
    },
})