// hooks/useClicker.js
import { useRef, useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import * as KeepAwake from 'expo-keep-awake';
import { ClickerEngine } from '../utility/ClickerEngine';

export const useClicker = (clickCallback) => {
  const [isRunning, setIsRunning] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const engineRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    engineRef.current = new ClickerEngine(clickCallback, setClickCount);
    engineRef.current.loadState();

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      if (engineRef.current) engineRef.current.stop();
      KeepAwake.deactivateKeepAwake();
    };
  }, [clickCallback]);

  const handleAppStateChange = (nextAppState) => {
    if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
      // App came to foreground – do nothing automatically
    } else if (nextAppState === 'background') {
      if (engineRef.current) engineRef.current.stop();
      setIsRunning(false);
      KeepAwake.deactivateKeepAwake();
    }
    appStateRef.current = nextAppState;
  };

  const start = useCallback((rate = 20) => {
    if (!engineRef.current) return;
    KeepAwake.activateKeepAwakeAsync();
    engineRef.current.start(rate);
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    if (!engineRef.current) return;
    KeepAwake.deactivateKeepAwake();
    engineRef.current.stop();
    setIsRunning(false);
  }, []);

  const setTarget = useCallback((target) => {
    if (engineRef.current) {
      engineRef.current.setTarget(target);
    }
  }, []);

  return {
    isRunning,
    clickCount,
    start,
    stop,
    setTarget,
  };
};