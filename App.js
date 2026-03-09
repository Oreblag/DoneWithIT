import { Keyboard } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import {  StyleSheet, Platform, Dimensions } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './app/navigation/rootNavigation';
import AuthNavigator from './app/navigation/AuthNavigator';
import navigationTheme from './app/navigation/navigationTheme';
import AppNavigator from './app/navigation/AppNavigator';
import OfflineNotice from './app/components/OfflineNotice';
import authStorage from './app/auth/storage';
import AuthContext from './app/auth/context';
import mobileAds from 'react-native-google-mobile-ads';
import logger from './app/utility/logger';


logger.start();


import { useDimensions, useDeviceOrientation } from '@react-native-community/hooks';
import WelcomeScreen from './app/screens/WelcomeScreen';
import ViewImageScreen from './app/screens/ViewImageScreen';
import MessagesScreen from './app/screens/MessagesScreen';
import AccountScreen from './app/screens/AccountScreen';
import ListingDetailsScreen from './app/screens/ListingDetailsScreen';
import ListingEditScreen from './app/screens/ListingEditScreen';
import ListingScreen from './app/screens/ListingsScreen';
import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import TestScreen from './app/screens/TestScreen';


SplashScreen.preventAutoHideAsync();

// At the top of App.js, before any other code

if (!Keyboard.removeListener) {
  Keyboard.removeListener = function(event, callback) {
    const error = new Error('Keyboard.removeListener was called from:');
    console.warn('Deprecated Keyboard.removeListener used', error.stack);
  };
}

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  // const restoreUser = async () => {
  //   const token = await authStorage.getUser();
  //   if (user) setUser(user);
  // };

  // if (!isReady)
  //   return <AppLoading startAsync={restoreUser} 
  //     onFinish={() => setIsReady(true)}/>

  // const { landscape } = useDeviceOrientation();
  // console.log(Dimensions.get("screen"));

  useEffect(() => {
    // Initialize the SDK
    mobileAds().initialize();
  }, []);
  

   useEffect(() => {
    async function prepare() {
      try {
        const restoredUser = await authStorage.getUser();
        if (restoredUser) {
          setUser(restoredUser);
        }

      } catch (e) {
        console.warn('Error during app preparation:', e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return null;
  }


  return (
    <GestureHandlerRootView>
      <AuthContext.Provider value={{ user, setUser }}>
        <OfflineNotice />
      {/* <AccountScreen /> */}
      {/* <ListingDetailsScreen /> */}
      {/* <ListingEditScreen /> */}
      {/* <ListingScreen /> */}
      {/* <LoginScreen /> */}
      {/* <MessagesScreen /> */}
      {/* <RegisterScreen /> */}
      {/* <ViewImageScreen /> */}
      {/* <WelcomeScreen /> */}
      {/* <TestScreen /> */}

        <NavigationContainer ref={navigationRef} theme={navigationTheme}>

          {user ? <AppNavigator /> : <AuthNavigator />}
          
        </NavigationContainer>
      </AuthContext.Provider>

    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
});
