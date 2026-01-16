import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { config } from '../config';

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
  registerForPushNotifications: () => Promise<void>;
}

export const usePushNotifications = (isAuthenticated: boolean): PushNotificationState => {
  const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();

  const notificationListener = useRef<Notifications.EventSubscription | undefined>(undefined);
  const responseListener = useRef<Notifications.EventSubscription | undefined>();

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return;
      }

      try {
        const projectId = config.expo.projectId;
        
        if (!projectId) {
          throw new Error('Project ID not found in config');
        }
        
        token = await Notifications.getExpoPushTokenAsync({
          projectId,
        });
        
        console.log('Expo Push Token:', token.data);
      } catch (e) {
        console.error('Error getting push token:', e);
      }
    } else {
      console.warn('Must use physical device for Push Notifications');
    }

    return token;
  }

  // Function to manually register for push notifications
  const registerForPushNotifications = useCallback(async () => {
    const token = await registerForPushNotificationsAsync();
    if (token) {
      setExpoPushToken(token);
      // TODO: Register this token with your Frappe backend
      // registerTokenWithServer(token.data);
    }
  }, []);

  useEffect(() => {
    // Only register for push notifications if user is authenticated
    if (isAuthenticated && !expoPushToken) {
      registerForPushNotifications();
    }

    // Listen for notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
      setNotification(notification);
    });

    // Listen for user interactions with notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
      // Handle notification tap here
      // You can navigate to specific screens based on response.notification.request.content.data
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [isAuthenticated, expoPushToken, registerForPushNotifications]);

  return {
    expoPushToken,
    notification,
    registerForPushNotifications,
  };
};

// Helper function to register token with your backend
export async function registerTokenWithServer(token: string) {
  // TODO: Implement API call to register token with Frappe backend
  console.log('Registering token with server:', token);
  // Example:
  // await fetch('https://pms.emiratesproperties.com/api/method/your.notification.method', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ token }),
  // });
}
