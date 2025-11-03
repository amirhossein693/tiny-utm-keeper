import { StoredUTMData, UTMParams } from './types.js';

/**
 * Check if we're in a browser environment
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
};

/**
 * Safely get item from localStorage
 */
export const getStorageItem = (key: string): string | null => {
  if (!isBrowser()) {
    return null;
  }
  
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn('[tiny-utm-keeper] Failed to read from localStorage:', error);
    return null;
  }
};

/**
 * Safely set item in localStorage
 */
export const setStorageItem = (key: string, value: string): boolean => {
  if (!isBrowser()) {
    return false;
  }
  
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn('[tiny-utm-keeper] Failed to write to localStorage:', error);
    return false;
  }
};

/**
 * Safely remove item from localStorage
 */
export const removeStorageItem = (key: string): boolean => {
  if (!isBrowser()) {
    return false;
  }
  
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn('[tiny-utm-keeper] Failed to remove from localStorage:', error);
    return false;
  }
};

/**
 * Get stored UTM data
 */
export const getStoredUTMData = (storageKey: string): StoredUTMData | null => {
  const data = getStorageItem(storageKey);
  
  if (!data) {
    return null;
  }
  
  try {
    const parsed: StoredUTMData = JSON.parse(data);
    
    // Check if expired
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      removeStorageItem(storageKey);
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.warn('[tiny-utm-keeper] Failed to parse stored UTM data:', error);
    return null;
  }
};

/**
 * Save UTM data to storage
 */
export const saveUTMData = (
  storageKey: string,
  params: UTMParams,
  expirationDays: number
): boolean => {
  const now = Date.now();
  const expiresAt = now + expirationDays * 24 * 60 * 60 * 1000;
  
  const data: StoredUTMData = {
    params,
    timestamp: now,
    expiresAt,
  };
  
  return setStorageItem(storageKey, JSON.stringify(data));
};

/**
 * Clear stored UTM data
 */
export const clearUTMData = (storageKey: string): boolean => {
  return removeStorageItem(storageKey);
};

