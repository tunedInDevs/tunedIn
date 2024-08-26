import * as SecureStore from 'expo-secure-store';

export const getStoredToken = async (): Promise<string | null> => {
    try {
        const token = await SecureStore.getItemAsync('spotify_jwt');
        return token;
    } catch (error) {
        console.error('Failed to retrieve token:', error);
        return null;
    }
};
