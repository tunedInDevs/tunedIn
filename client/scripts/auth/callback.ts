import axios, { AxiosResponse } from 'axios';

interface SpotifyProfile {
    id: string;
    [key: string]: any; // Extend this with other properties in the Spotify profile if needed
}

interface LoginResponse {
    token: string;
    profile: SpotifyProfile;
}

export const handleSpotifyCallback = async (code: string): Promise<LoginResponse> => {
    try {
        const response: AxiosResponse<LoginResponse> = await axios.get('/api/auth/callback', {
            params: { code },
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to authenticate with Spotify: ${error.response?.data || error.message}`);
    }
};
