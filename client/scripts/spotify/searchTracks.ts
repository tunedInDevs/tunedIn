import axios, { AxiosResponse } from 'axios';

interface SearchTracksParams {
    userId: string;
    query: string;
    market?: string;
    limit?: number;
    offset?: number;
    includeExternal?: string;
}

export const searchTracks = async ({
                                       userId,
                                       query,
                                       market,
                                       limit,
                                       offset,
                                       includeExternal,
                                   }: SearchTracksParams): Promise<string> => {
    try {
        const response: AxiosResponse<string> = await axios.get('/api/spotify/search', {
            params: { userId, query, market, limit, offset, includeExternal },
        });
        return response.data;
    } catch (error) {
        // @ts-ignore
        throw new Error(`Search failed: ${error.response?.data || error.message}`);
    }
};
