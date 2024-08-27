import { AxiosResponse } from 'axios';
import apiClient from '@/scripts/axiosConfig';

interface RatedTrack {
    spotifyTrackId: string;
    rating: number;
}

export const addRatedTrack = async (spotifyTrackId: string, rating: number): Promise<RatedTrack> => {
    try {
        const response: AxiosResponse<RatedTrack> = await apiClient.post('/api/me/rated-tracks', null, {
            params: { spotifyTrackId, rating }
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to add rated track: ${error.response?.data || error.message}`);
    }
};
