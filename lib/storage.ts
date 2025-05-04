import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

interface StorageAdapter {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

class WebStorage implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('WebStorage.getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('WebStorage.setItem error:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('WebStorage.removeItem error:', error);
    }
  }
}

class NativeStorage implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return await SecureStore.getItemAsync(key);
      }
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.warn('NativeStorage.getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        await SecureStore.setItemAsync(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('NativeStorage.setItem error:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        await SecureStore.deleteItemAsync(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('NativeStorage.removeItem error:', error);
    }
  }
}

// Export platform-specific storage implementation
export const storage: StorageAdapter = Platform.OS === 'web' 
  ? new WebStorage()
  : new NativeStorage();