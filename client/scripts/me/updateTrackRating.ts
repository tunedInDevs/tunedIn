import { AxiosResponse } from 'axios';
import apiClient from '@/scripts/axiosConfig';

interface RatedTrack {
    spotifyTrackId: string;
    rating: number;
}

export const updateTrackRating = async (spotifyTrackId: string, rating: number): Promise<RatedTrack> => {
    try {
        const response: AxiosResponse<RatedTrack> = await apiClient.put(`/api/me/rated-tracks/${spotifyTrackId}`, null, {
            params: { rating }
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to update track rating: ${error.response?.data || error.message}`);
    }
};
