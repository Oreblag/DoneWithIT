// screens/HomeScreen.js
import React, { useRef, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AdView from '../components/ads/AdView';
import { useClicker } from '../hooks/useClicker';

import AppText from '../components/AppText'
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';

export default function HomeScreen() {
  const adRef = useRef(null);
  const [rate, setRate] = useState('20');
  const [target, setTarget] = useState('1000000');

  const handleAutoClick = () => {
    if (adRef.current) {
      adRef.current.click();
    }
  };

  const { isRunning, clickCount, start, stop, setTarget: setEngineTarget } = useClicker(handleAutoClick);

  const handleStart = () => {
    const rateNum = parseInt(rate, 10);
    const targetNum = parseInt(target, 10);
    if (isNaN(rateNum) || rateNum <= 0) {
      Alert.alert('Invalid rate', 'Please enter a positive number.');
      return;
    }
    if (isNaN(targetNum) || targetNum <= 0) {
      Alert.alert('Invalid target', 'Please enter a positive number.');
      return;
    }
    setEngineTarget(targetNum);
    start(rateNum);
  };

  const progress = target ? (clickCount / parseInt(target, 10)) * 100 : 0;

  return (
    <View style={styles.container}>
      <AdView ref={adRef} style={styles.ad} />

      <View style={styles.stats}>
        <AppText style={styles.counter}>{clickCount}</AppText>
        <AppText style={styles.progress}>Progress: {progress.toFixed(1)}%</AppText>
        <AppText>Status: {isRunning ? '🟢 Running' : '🔴 Stopped'}</AppText>
      </View>

      <View style={styles.controls}>
        <View style={styles.inputRow}>
          <AppText>Rate (clicks/sec):</AppText>
          <AppTextInput
            style={styles.input}
            value={rate}
            onChangeText={setRate}
            keyboardType="numeric"
            editable={!isRunning}
          />
        </View>
        <View style={styles.inputRow}>
          <AppText>Target clicks:</AppText>
          <AppTextInput
            style={styles.input}
            value={target}
            onChangeText={setTarget}
            keyboardType="numeric"
            editable={!isRunning}
          />
        </View>
        <View style={styles.buttonRow}>
          <AppButton title="Start" onPress={handleStart} disabled={isRunning} />
          <AppButton title="Stop" onPress={stop} disabled={!isRunning} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
    },
  ad: { 
    marginBottom: 30, 
    width: '100%' 
    },
  stats: { 
    alignItems: 'center', 
    marginBottom: 30 
    },
  counter: { 
    fontSize: 24, 
    fontWeight: 'bold' 
    },
  progress: { 
    fontSize: 18, 
    marginVertical: 5 
    },
  controls: { 
    width: '100%' 
    },
  inputRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginVertical: 8 
    },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 8, 
    width: 100, 
    borderRadius: 4 
    },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 20 
    },
});