import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
    USER_INFO: '@user_info',
    AUTH_TOKEN: '@auth_token',
};

/**
 * Save data to AsyncStorage
 * @param key - The key under which to store the data
 * @param value - The value to store (will be stringified if it's an object)
 */
export const setItem = async (key: string, value: any) => {
    try {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        await AsyncStorage.setItem(key, stringValue);
    } catch (error) {
        console.error('Error saving data to AsyncStorage:', error);
    }
};

/**
 * Retrieve data from AsyncStorage
 * @param key - The key for the data to retrieve
 * @returns The retrieved data (parsed if it was stored as JSON)
 */
export const getItem = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        }
        return null;
    } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
        return null;
    }
};

/**
 * Remove data from AsyncStorage
 * @param key - The key for the data to remove
 */
export const removeItem = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing data from AsyncStorage:', error);
    }
};

/**
 * Clear all data from AsyncStorage
 */
export const clearAll = async () => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
    }
};
