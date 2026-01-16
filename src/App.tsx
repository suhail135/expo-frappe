import { Assets as NavigationAssets } from '@react-navigation/elements';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { createURL } from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import * as React from 'react';
import { useColorScheme } from 'react-native';
import { AppNavigation } from './navigation';
import { AuthProvider } from './auth';
import { FrappeNativeProvider, PushNotificationProvider } from './providers';

// Set the notification handler to control how notifications are displayed when the app is running
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

Asset.loadAsync([
  ...NavigationAssets,
  require('./assets/newspaper.png'),
  require('./assets/bell.png'),
]);

SplashScreen.preventAutoHideAsync();

const prefix = createURL('/');

export function App() {
  const colorScheme = useColorScheme();

  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

  return (
    <AuthProvider>
      <FrappeNativeProvider>
        <PushNotificationProvider>
          <AppNavigation
            theme={theme}
            linking={{
              enabled: true,
              prefixes: [prefix],
            }}
            onReady={() => {
              SplashScreen.hideAsync();
            }}
          />
        </PushNotificationProvider>
      </FrappeNativeProvider>
    </AuthProvider>
  );
}
