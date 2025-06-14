import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveToStorage<T>(key: string, value: T): Promise<void> {
  try {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(key, json);
  } catch (err) {
    console.error('저장 실패:', err);
  }
}

export async function loadFromStorage<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error('불러오기 실패:', err);
    return null;
  }
}
