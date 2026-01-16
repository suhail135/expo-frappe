import { FrappeProvider } from 'frappe-react-sdk';
import { PropsWithChildren } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { NetworkState, addNetworkStateListener } from 'expo-network';
import { useAuth } from '../auth';
import { config } from '../config';

interface FrappeNativeProviderProps {
  children: React.ReactNode;
}

export function FrappeNativeProvider({ children }: FrappeNativeProviderProps) {
  const { accessToken, isAuthenticated } = useAuth();

  // Function to get the current access token
  const getAccessToken = () => {
    return accessToken || '';
  };

  // Don't render FrappeProvider if not authenticated
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <FrappeProvider
      url={config.frappe.baseUrl}
      tokenParams={{
        type: 'Bearer',
        useToken: true,
        token: getAccessToken,
      }}
      swrConfig={{
        keepPreviousData: true,
        // A provider is required to use initFocus and initReconnect
        provider: () => new Map(),
        isVisible() {
          return AppState.currentState === 'active';
        },
        isOnline() {
          // We can't get the network state synchronously, so we'll assume online
          // The initReconnect handler will handle the actual network state changes
          return true;
        },
        initFocus(callback) {
          let appState = AppState.currentState;

          const onAppStateChange = (nextAppState: AppStateStatus) => {
            /* If it's resuming from background or inactive mode to active one */
            if (appState.match(/inactive|background/) && nextAppState === 'active') {
              callback();
            }
            appState = nextAppState;
          };

          // Subscribe to the app state change events
          const subscription = AppState.addEventListener('change', onAppStateChange);

          return () => {
            subscription.remove();
          };
        },
        initReconnect(callback) {
          let isConnected = true;

          const onNetworkStateChange = (state: NetworkState) => {
            const currentIsConnected = state.isInternetReachable ?? (state.isConnected ?? false);

            if (currentIsConnected !== isConnected) {
              isConnected = currentIsConnected;
              if (isConnected) {
                // Callback when the network is restored
                callback();
              }
            }
          };

          const subscription = addNetworkStateListener(onNetworkStateChange);

          return () => {
            subscription.remove();
          };
        },
      }}
    >
      {children}
    </FrappeProvider>
  );
}
