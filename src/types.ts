/**
 * UTM parameter names
 */
export const UTM_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

/**
 * UTM parameter object
 */
export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

/**
 * Stored UTM data with metadata
 */
export interface StoredUTMData {
  params: UTMParams;
  timestamp: number;
  expiresAt: number;
}

/**
 * Attribution mode
 */
export type AttributionMode = 'first-touch' | 'last-touch';

/**
 * Configuration options
 */
export interface UTMKeeperConfig {
  /**
   * Attribution mode: 'first-touch' or 'last-touch'
   * @default 'first-touch'
   */
  mode?: AttributionMode;
  
  /**
   * Expiration time in days
   * @default 30
   */
  expirationDays?: number;
  
  /**
   * localStorage key prefix
   * @default 'utm_keeper'
   */
  storageKey?: string;
  
  /**
   * Automatically capture UTMs on init
   * @default true
   */
  autoCapture?: boolean;
  
  /**
   * Custom URL to capture UTMs from (defaults to window.location.href)
   */
  captureUrl?: string;
}

/**
 * Fetch interceptor options
 */
export interface FetchOptions extends RequestInit {
  /**
   * Skip UTM injection for this request
   */
  skipUTM?: boolean;
}

