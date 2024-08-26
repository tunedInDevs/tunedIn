import axios, { AxiosResponse } from 'axios';

export const getTrack = async (trackId: string, userId: string): Promise<string> => {
    try {
        const response: AxiosResponse<string> = await axios.get(`/api/spotify/track/${trackId}`, {
            params: { userId },
        });
        return response.data;
    } catch (error) {
        // @ts-ignore
        throw new Error(`Failed to fetch track: ${error.response?.data || error.message}`);
    }
};
