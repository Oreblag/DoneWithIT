import { Platform} from 'react-native'
import React, { useEffect, useRef } from 'react'
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import expoPushTokensApi from '../api/expoPushTokens';
import navigation from "../navigation/rootNavigation";

export default function useNotifications(notificationListiner) {
  const responseListener = useRef();
  const notificationListener = useRef();


  useEffect(() => {
      Notifications.setNotificationHandler({handleNotification: async () => ({
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
      });
  
      registerForPushNotifications();

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'Default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
      }


      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification tapped:', response);

        const { data } = response.notification.request.content;
         
        if (data && data.screen) {
            navigation.navigate(data.screen, data.params || {});
        } else {
            navigation.navigate('Account');
        }
        });

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
        
        
        // if (notificationListener) Notifications.addListener(notificationListener)
    }, []);
  
  
    const registerForPushNotifications = async () => {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          console.log('Failed to get push token for push notification!');
          return;
        }
  
        const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId
  
  
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: projectId
        });
        console.log('Push token:', token.data);
        expoPushTokensApi.register(token.data);
        
      } catch (error) {
        console.log('Error getting a push token', error);
      }
    };
}

