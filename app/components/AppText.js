import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";

import defaultStyles from "../config/styles";

export default function AppText({ children, style, ...otherProps }) {
  return (
    <View>
      <Text style={[defaultStyles.text, style]} {...otherProps}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // text: {
  //     fontSize: 18,
  //     fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir"
  // },
  // text: {
  //     color: "tomato",
  //     ...Platform.select({
  //         ios: {
  //             fontSize: 20,
  //             fontFamily: "Avenir"
  //         },
  //         android: {
  //             fontSize: 18,
  //             fontFamily: "Roboto"
  //         },
  //     }),
  // },
});
