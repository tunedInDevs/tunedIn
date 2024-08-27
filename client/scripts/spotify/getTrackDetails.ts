import apiClient from '@/scripts/axiosConfig';

interface SpotifyTrackResponse {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: { images: Array<{ url: string }> };
    duration_ms: number;
    [key: string]: any;
}

export const getTrackDetails = async (trackId: string): Promise<SpotifyTrackResponse> => {
    try {
        const response = await apiClient.get<SpotifyTrackResponse>(`/api/spotify/track/${trackId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch track details: ${error.response?.data || error.message}`);
    }
};
