import axios, { AxiosResponse } from 'axios';

export const login = async (): Promise<string> => {
    try {
        const response: AxiosResponse<string> = await axios.get('/api/spotify/login');
        return response.data;
    } catch (error) {
        // @ts-ignore
        throw new Error(`Login failed: ${error.response?.data || error.message}`);
    }
};
