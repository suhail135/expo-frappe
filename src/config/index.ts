import Constants from 'expo-constants';

/**
 * Centralized configuration for the application
 * Values are loaded from app.config.js which reads from environment variables
 */

export const config = {
  frappe: {
    baseUrl: Constants.expoConfig?.extra?.frappeBaseUrl || 'https://your-frappe-instance.com',
    clientId: Constants.expoConfig?.extra?.frappeClientId || 'your_oauth_client_id',
    scopes: ['openid', 'all'],
  },
  app: {
    name: Constants.expoConfig?.name || 'Frappe Expo',
    scheme: Constants.expoConfig?.scheme || 'frappeexpo',
    version: Constants.expoConfig?.version || '1.0.0',
  },
  expo: {
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  },
};

/**
 * Get Frappe OAuth 2.0 Discovery Document
 * These endpoints are standard for Frappe OAuth 2.0
 */
export const getFrappeDiscovery = () => ({
  authorizationEndpoint: `${config.frappe.baseUrl}/api/method/frappe.integrations.oauth2.authorize`,
  tokenEndpoint: `${config.frappe.baseUrl}/api/method/frappe.integrations.oauth2.get_token`,
  revocationEndpoint: `${config.frappe.baseUrl}/api/method/frappe.integrations.oauth2.revoke_token`,
  userInfoEndpoint: `${config.frappe.baseUrl}/api/method/frappe.integrations.oauth2.openid_profile`,
});
