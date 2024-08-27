import apiClient from '@/scripts/axiosConfig';

interface SpotifySearchResponse {
    tracks?: {
        items: Array<Track>;
    };
    artists?: {
        items: Array<Artist>;
    };
    albums?: {
        items: Array<Album>;
    };
    playlists?: {
        items: Array<Playlist>;
    };
    shows?: {
        items: Array<Show>;
    };
    episodes?: {
        items: Array<Episode>;
    };
    audiobooks?: {
        items: Array<Audiobook>;
    };
}

interface Track {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: { images: Array<{ url: string }> };
    duration_ms: number;
    [key: string]: any; // To allow other properties if needed
}

interface Artist {
    id: string;
    name: string;
    images: Array<{ url: string }>;
    [key: string]: any;
}

interface Album {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    images: Array<{ url: string }>;
    [key: string]: any;
}

interface Playlist {
    id: string;
    name: string;
    images: Array<{ url: string }>;
    [key: string]: any;
}

interface Show {
    id: string;
    name: string;
    images: Array<{ url: string }>;
    [key: string]: any;
}

interface Episode {
    id: string;
    name: string;
    images: Array<{ url: string }>;
    [key: string]: any;
}

interface Audiobook {
    id: string;
    name: string;
    authors: Array<{ name: string }>;
    images: Array<{ url: string }>;
    [key: string]: any;
}

export const searchSpotify = async (
    query: string,
    type: string,
    market?: string,
    limit?: number,
    offset?: number,
    includeExternal?: string
): Promise<SpotifySearchResponse> => {
    try {
        const response = await apiClient.get<SpotifySearchResponse>('/api/spotify/search', {
            params: {
                query,
                type,
                market,
                limit,
                offset,
                includeExternal,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(`Search failed: ${error.response?.data || error.message}`);
    }
};
