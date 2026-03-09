import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import * as Progress from "react-native-progress";
import LottieView from "lottie-react-native";
import doneAnime from '../assets/animations/done.json'

import colors from "../config/colors";
import AppText from "../components/AppText";

function UploadScreen({ onDone, progress = 0, visible = false }) {
  return (
    <Modal visible={visible} transparent={false}>
      
      <View style={styles.container}>
        {progress < 1 ? (
          <Progress.Bar
            color={colors.primary}
            progress={progress}
            width={200}
          />
        ) : (
          <LottieView
            autoPlay
            loop={false}
            onAnimationFinish={onDone}
            source={doneAnime}
            style={styles.animation}
          />
        )}
        <AppText style={styles.text}>Progress: {Math.round(progress * 100)}%</AppText>
      </View>
      
    </Modal>
  );
}

const styles = StyleSheet.create({
  animation: {
    width: 150,
    height: 150,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    color: 'black',
  },
});

export default UploadScreen;
