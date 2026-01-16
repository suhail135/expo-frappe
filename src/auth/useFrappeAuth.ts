import { useEffect, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
  exchangeCodeAsync,
} from 'expo-auth-session';
import { config, getFrappeDiscovery } from '../config';
import { useAuth } from './AuthContext';

// Required for web: Completes the auth session when the popup redirects
WebBrowser.maybeCompleteAuthSession();

// Get the discovery document for Frappe OAuth
const discovery = getFrappeDiscovery();

// Create the redirect URI
// This will use the scheme from app.config.js
const redirectUri = makeRedirectUri({
  scheme: Array.isArray(config.app.scheme) ? config.app.scheme[0] : config.app.scheme,
  path: 'auth/callback',
});

export function useFrappeAuth() {
  const { signIn, signOut, isAuthenticated, isLoading, accessToken } = useAuth();

  // Configure the auth request with PKCE (recommended for mobile apps)
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: config.frappe.clientId,
      scopes: config.frappe.scopes,
      redirectUri,
      // Use PKCE for better security
      usePKCE: true,
      // Request authorization code (will be exchanged for tokens)
      responseType: ResponseType.Code,
    },
    discovery
  );

  // Handle the OAuth response
  useEffect(() => {
    async function handleResponse() {
      if (response?.type === 'success') {
        const { code } = response.params;
        
        try {
          // Exchange the authorization code for tokens
          // Note: For production, you should do this on your server
          // to keep the client_secret secure
          const tokenResponse = await exchangeCodeAsync(
            {
              clientId: config.frappe.clientId,
              code,
              redirectUri,
              // Include code_verifier for PKCE
              extraParams: request?.codeVerifier
                ? { code_verifier: request.codeVerifier }
                : undefined,
            },
            {
              tokenEndpoint: discovery.tokenEndpoint,
            }
          );

          // Save the tokens to auth context
          await signIn({
            accessToken: tokenResponse.accessToken,
            refreshToken: tokenResponse.refreshToken || undefined,
            idToken: tokenResponse.idToken || undefined,
            expiresIn: tokenResponse.expiresIn || undefined,
          });
        } catch (error) {
          console.error('Error exchanging code for tokens:', error);
        }
      }
    }

    handleResponse();
  }, [response, request?.codeVerifier, signIn]);

  // Function to trigger the OAuth flow
  const login = useCallback(async () => {
    try {
      // Warm up the browser for better UX on Android
      if (request) {
        await promptAsync();
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }, [request, promptAsync]);

  // Function to logout
  const logout = useCallback(async () => {
    try {
      // Optionally revoke the token on the server
      // For now, just clear local state
      await signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, [signOut]);

  return {
    login,
    logout,
    isAuthenticated,
    isLoading,
    accessToken,
    // The request is loading if it's null
    isRequestLoading: !request,
    // Expose the redirect URI for debugging/configuration
    redirectUri,
  };
}

// Export redirect URI for reference when setting up OAuth client in Frappe
export { redirectUri };
