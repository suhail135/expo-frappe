module.exports = {
  expo: {
    name: process.env.APP_NAME || 'frappe-expo',
    slug: process.env.APP_SLUG || 'expo-frappe',
    version: '1.0.0',
    orientation: 'default',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    scheme: process.env.APP_SCHEME || 'frappeexpo',
    ios: {
      supportsTablet: true,
      bundleIdentifier: process.env.IOS_BUNDLE_ID || 'com.frappeexpo',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: process.env.ANDROID_PACKAGE || 'com.frappeexpo',
      googleServicesFile: './src/firebase/google-services.json',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-asset',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#ffffff',
          image: './assets/splash-icon.png',
        },
      ],
      'expo-secure-store',
      'expo-web-browser',
      'expo-notifications'
    ],
    extra: {
      frappeBaseUrl: process.env.FRAPPE_BASE_URL || 'https://your-frappe-instance.com',
      frappeClientId: process.env.FRAPPE_CLIENT_ID || 'your_oauth_client_id',
      eas: {
        projectId: process.env.EXPO_PROJECT_ID || '8789f779-e152-43df-8173-154784e5d268',
      },
    },
    owner: process.env.EXPO_OWNER || 'suhaileps-organization',
  },
};
