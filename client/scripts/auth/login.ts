import axios, { AxiosResponse } from 'axios';
import { API_BASE_URL } from '@env';

export const getSpotifyLoginUrl = async (): Promise<string> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/login`);
        return response.data.uri;
    } catch (error) {
        throw new Error(`Failed to retrieve Spotify login URL: ${error.response?.data || error.message}`);
    }
};

