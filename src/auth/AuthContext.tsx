import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { refreshAsync } from 'expo-auth-session';
import { FRAPPE_CONFIG, getFrappeDiscovery } from './config';

// Keys for secure storage - split tokens to avoid 2048 byte limit
const ACCESS_TOKEN_KEY = 'frappe_access_token';
const REFRESH_TOKEN_KEY = 'frappe_refresh_token';
const TOKEN_META_KEY = 'frappe_token_meta'; // For expiresAt and other metadata

// Get Frappe discovery document
const discovery = getFrappeDiscovery(FRAPPE_CONFIG.baseUrl);

// Token metadata (small data that fits in SecureStore)
interface TokenMeta {
  expiresAt: number | null;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  expiresAt: number | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (tokens: {
    accessToken: string;
    refreshToken?: string;
    idToken?: string;
    expiresIn?: number;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  idToken: null,
  expiresAt: null,
  isLoading: true,
  isAuthenticated: false,
};

export const AuthContext = React.createContext<AuthContextType | undefined>(
  undefined
);

// Helper to store auth state securely - split into separate keys to avoid size limit
async function storeAuthState(state: Omit<AuthState, 'isLoading' | 'isAuthenticated'>): Promise<void> {
  if (Platform.OS !== 'web') {
    // Store tokens separately to avoid 2048 byte limit
    if (state.accessToken) {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, state.accessToken);
    }
    if (state.refreshToken) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, state.refreshToken);
    }
    // Store metadata (small)
    const meta: TokenMeta = { expiresAt: state.expiresAt };
    await SecureStore.setItemAsync(TOKEN_META_KEY, JSON.stringify(meta));
    // Note: idToken is not stored as it's large and typically only needed once
  } else {
    // For web, use localStorage (no size limit issues)
    const value = JSON.stringify(state);
    localStorage.setItem(ACCESS_TOKEN_KEY, value);
  }
}

// Helper to retrieve auth state from secure storage
async function getStoredAuthState(): Promise<Omit<AuthState, 'isLoading' | 'isAuthenticated'> | null> {
  try {
    if (Platform.OS !== 'web') {
      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      const metaStr = await SecureStore.getItemAsync(TOKEN_META_KEY);
      
      if (accessToken) {
        const meta: TokenMeta = metaStr ? JSON.parse(metaStr) : { expiresAt: null };
        return {
          accessToken,
          refreshToken,
          idToken: null, // Not stored due to size
          expiresAt: meta.expiresAt,
        };
      }
    } else {
      const value = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (value) {
        return JSON.parse(value);
      }
    }
  } catch (error) {
    console.error('Error retrieving auth state:', error);
  }
  return null;
}

// Helper to clear auth state from secure storage
async function clearAuthState(): Promise<void> {
  if (Platform.OS !== 'web') {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(TOKEN_META_KEY);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>(initialState);

  // Restore authentication state on app start
  React.useEffect(() => {
    async function restoreAuthState() {
      try {
        const storedState = await getStoredAuthState();
        
        if (storedState && storedState.accessToken) {
          // Check if token is expired
          const isExpired = storedState.expiresAt 
            ? Date.now() > storedState.expiresAt 
            : false;

          if (!isExpired) {
            setState({
              ...storedState,
              isLoading: false,
              isAuthenticated: true,
            });
            return;
          }
          
          // Token expired, try to refresh if we have a refresh token
          if (storedState.refreshToken) {
            try {
              
              const tokenResponse = await refreshAsync(
                {
                  clientId: FRAPPE_CONFIG.clientId,
                  refreshToken: storedState.refreshToken,
                },
                {
                  tokenEndpoint: discovery.tokenEndpoint,
                }
              );

              const expiresAt = tokenResponse.expiresIn
                ? Date.now() + tokenResponse.expiresIn * 1000
                : null;

              const newState = {
                accessToken: tokenResponse.accessToken,
                refreshToken: tokenResponse.refreshToken || storedState.refreshToken,
                idToken: tokenResponse.idToken || storedState.idToken,
                expiresAt,
              };

              await storeAuthState(newState);

              setState({
                ...newState,
                isLoading: false,
                isAuthenticated: true,
              });
              
              return;
            } catch (refreshError) {
              console.error('Failed to refresh token:', refreshError);
              // Refresh failed, clear auth state
              await clearAuthState();
            }
          }
        }
        
        setState({
          ...initialState,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error restoring auth state:', error);
        setState({
          ...initialState,
          isLoading: false,
        });
      }
    }

    restoreAuthState();
  }, []);

  const signIn = React.useCallback(
    async (tokens: {
      accessToken: string;
      refreshToken?: string;
      idToken?: string;
      expiresIn?: number;
    }) => {
      const expiresAt = tokens.expiresIn 
        ? Date.now() + tokens.expiresIn * 1000 
        : null;

      const newState = {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || null,
        idToken: tokens.idToken || null,
        expiresAt,
      };

      await storeAuthState(newState);

      setState({
        ...newState,
        isLoading: false,
        isAuthenticated: true,
      });
    },
    []
  );

  const signOut = React.useCallback(async () => {
    await clearAuthState();
    setState({
      ...initialState,
      isLoading: false,
    });
  }, []);

  const refreshAccessToken = React.useCallback(async () => {
    const { refreshToken } = state;
    
    if (!refreshToken) {
      console.warn('No refresh token available');
      // No refresh token, user needs to log in again
      await clearAuthState();
      setState({
        ...initialState,
        isLoading: false,
      });
      return;
    }

    try {
      // Use Frappe's token endpoint to refresh the access token
      const tokenResponse = await refreshAsync(
        {
          clientId: FRAPPE_CONFIG.clientId,
          refreshToken,
        },
        {
          tokenEndpoint: discovery.tokenEndpoint,
        }
      );

      const expiresAt = tokenResponse.expiresIn
        ? Date.now() + tokenResponse.expiresIn * 1000
        : null;

      const newState = {
        accessToken: tokenResponse.accessToken,
        refreshToken: tokenResponse.refreshToken || refreshToken, // Keep old refresh token if new one not provided
        idToken: tokenResponse.idToken || state.idToken,
        expiresAt,
      };

      await storeAuthState(newState);

      setState({
        ...newState,
        isLoading: false,
        isAuthenticated: true,
      });

    } catch (error) {
      console.error('Error refreshing token:', error);
      // Refresh failed, clear auth state and require re-login
      await clearAuthState();
      setState({
        ...initialState,
        isLoading: false,
      });
    }
  }, [state]);

  const value = React.useMemo(
    () => ({
      ...state,
      signIn,
      signOut,
      refreshAccessToken,
    }),
    [state, signIn, signOut, refreshAccessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
