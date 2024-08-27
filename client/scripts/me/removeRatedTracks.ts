import { AxiosResponse } from 'axios';
import apiClient from '@/scripts/axiosConfig';

interface RatedTrack {
    spotifyTrackId: string;
    rating: number;
}

export const removeRatedTrack = async (spotifyTrackId: string): Promise<RatedTrack> => {
    try {
        const response: AxiosResponse<RatedTrack> = await apiClient.delete(`/api/me/rated-tracks/${spotifyTrackId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to remove rated track: ${error.response?.data || error.message}`);
    }
};
