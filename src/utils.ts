import { UTMParams, UTM_PARAMS } from './types.js';

/**
 * Extract UTM parameters from a URL string
 */
export const extractUTMsFromURL = (url: string): UTMParams | null => {
  try {
    const urlObj = new URL(url);
    const params: UTMParams = {};
    let hasUTM = false;
    
    for (const param of UTM_PARAMS) {
      const value = urlObj.searchParams.get(param);
      if (value) {
        params[param] = value;
        hasUTM = true;
      }
    }
    
    return hasUTM ? params : null;
  } catch (error) {
    console.warn('[tiny-utm-keeper] Invalid URL:', error);
    return null;
  }
};

/**
 * Extract UTM parameters from current page URL (browser only)
 */
export const extractUTMsFromCurrentURL = (): UTMParams | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return extractUTMsFromURL(window.location.href);
};

/**
 * Append UTM parameters to a URL
 */
export const appendUTMsToURL = (url: string, utmParams: UTMParams): string => {
  try {
    const urlObj = new URL(url);
    
    for (const [key, value] of Object.entries(utmParams)) {
      if (value && UTM_PARAMS.includes(key as any)) {
        // Only add if not already present
        if (!urlObj.searchParams.has(key)) {
          urlObj.searchParams.set(key, value);
        }
      }
    }
    
    return urlObj.toString();
  } catch (error) {
    console.warn('[tiny-utm-keeper] Failed to append UTMs to URL:', error);
    return url;
  }
};

/**
 * Check if UTM parameters object is empty
 */
export const hasUTMParams = (params: UTMParams | null): params is UTMParams => {
  if (!params) return false;
  return Object.keys(params).length > 0;
};

/**
 * Merge two UTM parameter objects
 */
export const mergeUTMParams = (
  base: UTMParams,
  override: UTMParams
): UTMParams => {
  return { ...base, ...override };
};

/**
 * Convert UTM parameters to query string
 */
export const utmParamsToQueryString = (params: UTMParams): string => {
  const entries = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`);
  
  return entries.join('&');
};

/**
 * Convert UTM parameters to object for fetch body
 */
export const utmParamsToObject = (params: UTMParams): Record<string, string> => {
  const result: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  
  return result;
};

