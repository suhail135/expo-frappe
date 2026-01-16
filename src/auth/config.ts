// Frappe OAuth 2.0 Configuration
// This file is deprecated - use src/config/index.ts instead
import { config, getFrappeDiscovery as getDiscovery } from '../config';

/**
 * @deprecated Use config from src/config/index.ts instead
 */
export const FRAPPE_CONFIG = {
  baseUrl: config.frappe.baseUrl,
  clientId: config.frappe.clientId,
  scopes: config.frappe.scopes,
};

/**
 * @deprecated Use getFrappeDiscovery from src/config/index.ts instead
 */
export const getFrappeDiscovery = (baseUrl?: string) => getDiscovery();
