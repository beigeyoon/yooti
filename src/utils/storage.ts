import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// 플랫폼별 스토리지 어댑터
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await AsyncStorage.getItem(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await AsyncStorage.setItem(key, value);
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await AsyncStorage.removeItem(key);
  },

  async clear(): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.clear();
      return;
    }
    await AsyncStorage.clear();
  },

  async getAllKeys(): Promise<string[]> {
    if (Platform.OS === 'web') {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) keys.push(key);
      }
      return keys;
    }
    const keys = await AsyncStorage.getAllKeys();
    return keys as string[];
  },
};

export async function saveToStorage<T>(key: string, value: T): Promise<void> {
  try {
    const json = JSON.stringify(value);
    await storage.setItem(key, json);
  } catch (err) {
    console.error('저장 실패:', err);
  }
}

export async function loadFromStorage<T>(key: string): Promise<T | null> {
  try {
    const raw = await storage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error('불러오기 실패:', err);
    return null;
  }
}

export async function removeFromStorage(key: string): Promise<void> {
  try {
    await storage.removeItem(key);
  } catch (err) {
    console.error('삭제 실패:', err);
  }
}

export async function clearStorage(): Promise<void> {
  try {
    await storage.clear();
  } catch (err) {
    console.error('전체 삭제 실패:', err);
  }
}

export async function getAllStorageKeys(): Promise<string[]> {
  try {
    return await storage.getAllKeys();
  } catch (err) {
    console.error('키 목록 불러오기 실패:', err);
    return [];
  }
}
