import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { useFrappeAuth } from '../../auth';

export function Login() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const { login, isRequestLoading, isLoading } = useFrappeAuth();

  const handleLogin = async () => {
    await login();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#007AFF'} />
        <Text style={[styles.loadingText, isDark && styles.textDark]}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.content}>
        {/* Logo/Branding Section */}
        <View style={styles.brandingSection}>
          <Text style={[styles.appName, isDark && styles.textDark]}>
            Frappe Expo
          </Text>
          <Text style={[styles.tagline, isDark && styles.taglineDark]}>
            Connect to your Frappe instance
          </Text>
        </View>

        {/* Login Section */}
        <View style={styles.loginSection}>
          <TouchableOpacity
            style={[styles.loginButton, isRequestLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isRequestLoading}
          >
            {isRequestLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login with Frappe</Text>
            )}
          </TouchableOpacity>

          <Text style={[styles.disclaimer, isDark && styles.disclaimerDark]}>
            You will be redirected to your Frappe instance to authenticate
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, isDark && styles.footerTextDark]}>
          Powered by Frappe OAuth 2.0
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  brandingSection: {
    alignItems: 'center',
    marginBottom: 64,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  taglineDark: {
    color: '#999',
  },
  textDark: {
    color: '#fff',
  },
  loginSection: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#999',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  disclaimer: {
    marginTop: 16,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  disclaimerDark: {
    color: '#666',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
  footerTextDark: {
    color: '#666',
  },
});
