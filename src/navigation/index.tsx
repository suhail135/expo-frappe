import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HeaderButton, Text } from '@react-navigation/elements';
import {
  createStaticNavigation,
  StaticParamList,
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  Theme,
  LinkingOptions,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, ActivityIndicator, View } from 'react-native';
import bell from '../assets/bell.png';
import newspaper from '../assets/newspaper.png';
import { Home } from './screens/Home';
import { Profile } from './screens/Profile';
import { Settings } from './screens/Settings';
import { Updates } from './screens/Updates';
import { NotFound } from './screens/NotFound';
import { Login } from './screens/Login';
import { useAuth } from '../auth';

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        title: 'Feed',
        tabBarIcon: ({ color, size }) => (
          <Image
            source={newspaper}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
    Updates: {
      screen: Updates,
      options: {
        tabBarIcon: ({ color, size }) => (
          <Image
            source={bell}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: 'Home',
        headerShown: false,
      },
    },
    Profile: {
      screen: Profile,
      options: {
        title: 'Profile',
      },
    },
    Settings: {
      screen: Settings,
      options: ({ navigation }) => ({
        presentation: 'modal',
        headerRight: () => (
          <HeaderButton onPress={navigation.goBack}>
            <Text>Close</Text>
          </HeaderButton>
        ),
      }),
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: '404',
      },
      linking: {
        path: '*',
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

// Auth Stack for unauthenticated users
const AuthStack = createNativeStackNavigator({
  screens: {
    Login: {
      screen: Login,
      options: {
        headerShown: false,
      },
    },
  },
});

const AuthNavigation = createStaticNavigation(AuthStack);

type RootStackParamList = StaticParamList<typeof RootStack>;
type AuthStackParamList = StaticParamList<typeof AuthStack>;

// Navigation wrapper that handles auth state (Route Guard)
interface NavigationProps {
  theme: Theme;
  linking: LinkingOptions<RootStackParamList>;
  onReady?: () => void;
}

export function AppNavigation({ theme, linking, onReady }: NavigationProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Show auth navigator if not authenticated
  if (!isAuthenticated) {
    return <AuthNavigation theme={theme} onReady={onReady} />;
  }

  // Show main app navigator if authenticated
  return <Navigation theme={theme} linking={linking} onReady={onReady} />;
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
    interface AuthParamList extends AuthStackParamList {}
  }
}
