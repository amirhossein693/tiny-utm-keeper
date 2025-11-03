/**
 * tiny-utm-keeper
 * 
 * Zero-dependency, TypeScript-first UTM parameter tracker
 * for first-touch/last-touch attribution. SSR-friendly.
 */

// Export main class
export { UTMKeeper } from './utm.js';

// Export convenience functions
export {
  init,
  getInstance,
  capture,
  getUTMs,
  getUTMData,
  clear,
  appendToURL,
  getUTMObject,
  createFetch,
  hasStoredUTMs,
} from './utm.js';

// Export types
export type {
  UTMParams,
  UTMKeeperConfig,
  AttributionMode,
  StoredUTMData,
  FetchOptions,
} from './types.js';

// Export utilities
export {
  extractUTMsFromURL,
  extractUTMsFromCurrentURL,
  appendUTMsToURL,
  hasUTMParams,
  mergeUTMParams,
  utmParamsToQueryString,
  utmParamsToObject,
} from './utils.js';

// Export storage utilities (for advanced use cases)
export {
  isBrowser,
  getStoredUTMData,
  saveUTMData,
  clearUTMData,
} from './storage.js';

// Re-export constants
export { UTM_PARAMS } from './types.js';

