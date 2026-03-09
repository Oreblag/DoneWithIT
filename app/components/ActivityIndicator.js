import React from "react";
import LottieView from "lottie-react-native";
import loadingAnime from '../assets/animations/loaderdot.json'

import { StyleSheet, View } from "react-native";

function ActivityIndicator({ visible = false }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <LottieView
        autoPlay
        loop
        source={loadingAnime}
        style={styles.animation}
      />
    </View>
  );
}

export default ActivityIndicator;

const styles = StyleSheet.create({
  animation: {
    width: 150, 
    height: 150,
    alignSelf: 'center'
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'white',
    height: '100%',
    opacity: 0.8,
    width: '100%',
    zIndex: 1,
  }
})