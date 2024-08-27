import { AxiosResponse } from 'axios';
import apiClient from '@/scripts/axiosConfig';

interface Track {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: { images: Array<{ url: string }> };
    duration_ms: number;
    [key: string]: any; // To allow other properties if needed
}
interface UserRatedTrackResponse {
    track: Track;
    rating: number;
    // Extend with other necessary fields
}

export const getUserRatedTracks = async (): Promise<UserRatedTrackResponse[]> => {
    try {
        const response: AxiosResponse<UserRatedTrackResponse[]> = await apiClient.get('/api/me/rated-tracks');
        return response.data;
    } catch (error) {
        throw new Error(`Failed to retrieve rated tracks: ${error.response?.data || error.message}`);
    }
};
