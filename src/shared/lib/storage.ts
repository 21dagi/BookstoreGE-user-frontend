/**
 * Safe local storage wrapper with memory fallback for resilient webview storage.
 */

const memoryStore = new Map<string, string>();

function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export const safeStorage = {
  getItem(key: string): string | null {
    if (isStorageAvailable()) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return memoryStore.get(key) ?? null;
      }
    }
    return memoryStore.get(key) ?? null;
  },

  setItem(key: string, value: string): void {
    if (isStorageAvailable()) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch {
        // Fallback to memory
      }
    }
    memoryStore.set(key, value);
  },

  removeItem(key: string): void {
    if (isStorageAvailable()) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Fallback to memory
      }
    }
    memoryStore.delete(key);
  },

  getJSON<T>(key: string, fallback: T): T {
    const item = this.getItem(key);
    if (!item) return fallback;
    try {
      return JSON.parse(item) as T;
    } catch {
      return fallback;
    }
  },

  setJSON<T>(key: string, value: T): void {
    try {
      this.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore serialization errors
    }
  },
};
