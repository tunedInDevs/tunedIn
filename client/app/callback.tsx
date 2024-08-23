import React, { useEffect, useState } from 'react';
import { View, Text, Linking } from 'react-native';
import axios from 'axios';

interface LinkingEvent {
    url: string;
}

const SpotifyAuthCallback: React.FC = () => {
    const [authStatus, setAuthStatus] = useState<string>('Waiting for authentication...');

    useEffect(() => {
        const handleDeepLink = async (event: LinkingEvent) => {
            const { url } = event;
            if (url.includes('localhost:8081/callback')) {
                const code = url.split('code=')[1];
                if (code) {
                    try {
                        const response = await axios.get<string>(`http://localhost:8080/api/spotify/callback?code=${code}`);
                        setAuthStatus('Authentication successful: ' + response.data);
                    } catch (error) {
                        if (axios.isAxiosError(error)) {
                            setAuthStatus('Authentication failed: ' + error.message);
                        } else {
                            setAuthStatus('An unexpected error occurred');
                        }
                    }
                } else {
                    setAuthStatus('No authorization code found in the URL');
                }
            }
        };

        // Add event listener for deep linking
        const subscription = Linking.addEventListener('url', handleDeepLink);

        // Check if the app was opened with a deep link
        Linking.getInitialURL().then((url: string | null) => {
            if (url) {
                handleDeepLink({ url });
            }
        });

        // Clean up the event listener
        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{authStatus}</Text>
        </View>
    );
};

export default SpotifyAuthCallback;