import {
  UTMKeeperConfig,
  UTMParams,
  AttributionMode,
  FetchOptions,
} from './types';
import {
  getStoredUTMData,
  saveUTMData,
  clearUTMData,
  isBrowser,
} from './storage';
import {
  extractUTMsFromURL,
  extractUTMsFromCurrentURL,
  appendUTMsToURL,
  hasUTMParams,
  utmParamsToObject,
} from './utils';

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<Omit<UTMKeeperConfig, 'captureUrl'>> = {
  mode: 'first-touch',
  expirationDays: 30,
  storageKey: 'utm_keeper',
  autoCapture: true,
};

/**
 * UTMKeeper class - Main API
 */
export class UTMKeeper {
  private config: Required<Omit<UTMKeeperConfig, 'captureUrl'>>;
  
  constructor(config: UTMKeeperConfig = {}) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };
    
    // Auto-capture on init if enabled
    if (this.config.autoCapture && isBrowser()) {
      this.capture(config.captureUrl);
    }
  }
  
  /**
   * Capture UTM parameters from URL
   */
  capture(url?: string): boolean {
    if (!isBrowser()) {
      return false;
    }
    
    const utmParams = url
      ? extractUTMsFromURL(url)
      : extractUTMsFromCurrentURL();
    
    if (!hasUTMParams(utmParams)) {
      return false;
    }
    
    // Check attribution mode
    if (this.config.mode === 'first-touch') {
      const existing = getStoredUTMData(this.config.storageKey);
      if (existing && hasUTMParams(existing.params)) {
        // Already have first-touch data, don't override
        return false;
      }
    }
    
    // Save UTM data (for both first-touch and last-touch)
    return saveUTMData(
      this.config.storageKey,
      utmParams,
      this.config.expirationDays
    );
  }
  
  /**
   * Get stored UTM parameters
   */
  getUTMs(): UTMParams | null {
    if (!isBrowser()) {
      return null;
    }
    
    const data = getStoredUTMData(this.config.storageKey);
    return data ? data.params : null;
  }
  
  /**
   * Get stored UTM data with metadata
   */
  getUTMData() {
    if (!isBrowser()) {
      return null;
    }
    
    return getStoredUTMData(this.config.storageKey);
  }
  
  /**
   * Clear stored UTM parameters
   */
  clear(): boolean {
    return clearUTMData(this.config.storageKey);
  }
  
  /**
   * Append stored UTMs to a URL
   */
  appendToURL(url: string): string {
    const utms = this.getUTMs();
    if (!hasUTMParams(utms)) {
      return url;
    }
    
    return appendUTMsToURL(url, utms);
  }
  
  /**
   * Get UTM parameters as object for API calls
   */
  getUTMObject(): Record<string, string> {
    const utms = this.getUTMs();
    if (!hasUTMParams(utms)) {
      return {};
    }
    
    return utmParamsToObject(utms);
  }
  
  /**
   * Create a fetch wrapper that automatically injects UTMs
   */
  createFetch(): typeof fetch {
    const originalFetch = fetch;
    const self = this;
    
    return function utmFetch(
      input: RequestInfo | URL,
      init?: FetchOptions
    ): Promise<Response> {
      // Skip if explicitly disabled or not in browser
      if (!isBrowser() || init?.skipUTM) {
        const { skipUTM, ...cleanInit } = init || {};
        return originalFetch(input, cleanInit);
      }
      
      const utms = self.getUTMs();
      if (!hasUTMParams(utms)) {
        return originalFetch(input, init);
      }
      
      // Handle URL injection
      let modifiedInput = input;
      
      if (typeof input === 'string') {
        modifiedInput = appendUTMsToURL(input, utms);
      } else if (input instanceof URL) {
        modifiedInput = new URL(appendUTMsToURL(input.toString(), utms));
      } else if (input instanceof Request) {
        modifiedInput = new Request(
          appendUTMsToURL(input.url, utms),
          input
        );
      }
      
      return originalFetch(modifiedInput, init);
    };
  }
  
  /**
   * Update configuration
   */
  updateConfig(config: Partial<UTMKeeperConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
  }
  
  /**
   * Get current configuration
   */
  getConfig(): Readonly<Required<Omit<UTMKeeperConfig, 'captureUrl'>>> {
    return { ...this.config };
  }
  
  /**
   * Check if UTMs are currently stored
   */
  hasStoredUTMs(): boolean {
    return hasUTMParams(this.getUTMs());
  }
  
  /**
   * Get attribution mode
   */
  getMode(): AttributionMode {
    return this.config.mode;
  }
  
  /**
   * Set attribution mode
   */
  setMode(mode: AttributionMode): void {
    this.config.mode = mode;
  }
}

/**
 * Create a singleton instance for convenience
 */
let defaultInstance: UTMKeeper | null = null;

/**
 * Initialize the default UTMKeeper instance
 */
export const init = (config: UTMKeeperConfig = {}): UTMKeeper => {
  defaultInstance = new UTMKeeper(config);
  return defaultInstance;
};

/**
 * Get the default instance (creates one if it doesn't exist)
 */
export const getInstance = (): UTMKeeper => {
  if (!defaultInstance) {
    defaultInstance = new UTMKeeper();
  }
  return defaultInstance;
};

/**
 * Convenience functions using the default instance
 */
export const capture = (url?: string): boolean => getInstance().capture(url);
export const getUTMs = (): UTMParams | null => getInstance().getUTMs();
export const getUTMData = () => getInstance().getUTMData();
export const clear = (): boolean => getInstance().clear();
export const appendToURL = (url: string): string => getInstance().appendToURL(url);
export const getUTMObject = (): Record<string, string> => getInstance().getUTMObject();
export const createFetch = (): typeof fetch => getInstance().createFetch();
export const hasStoredUTMs = (): boolean => getInstance().hasStoredUTMs();

