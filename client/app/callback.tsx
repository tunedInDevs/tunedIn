import React, { useEffect, useState } from 'react';
import { View, Linking, ActivityIndicator } from 'react-native';
import axios from 'axios';

interface LinkingEvent {
    url: string;
}

const SpotifyAuthCallback: React.FC = () => {

    useEffect(() => {
        const handleDeepLink = async (event: LinkingEvent) => {
            const { url } = event;
            if (url.includes('localhost:8081/callback')) {
                const code = url.split('code=')[1];
                if (code) {
                    try {
                        const response = await axios.get<string>(`http://localhost:8080/api/spotify/callback?code=${code}`);
                        window.location.href = "http://localhost:8081/home";
                        console.log("Authentication Sucessful: ", response.data)
                    } catch (error) {
                        if (axios.isAxiosError(error)) {
                            console.log('Authentication failed: ' + error.message);
                        } else {
                            console.log('An unexpected error occurred');
                        }
                    }
                } else {
                    console.log('No authorization code found in the URL');
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
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
};

export default SpotifyAuthCallback;