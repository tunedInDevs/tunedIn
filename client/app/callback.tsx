import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation, useRoute } from '@react-navigation/native';
import { handleSpotifyCallback } from '@/scripts/auth/callback';

export default function Callback() {
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation();
    const route = useRoute();

    // Extract the `code` parameter from the navigation route's params
    const code = route.params?.code || null;

    useEffect(() => {
        if (code) {
            authenticateWithSpotify(code);
        } else {
            console.log('No code received');
            setLoading(false);
        }
    }, [code]);

    const authenticateWithSpotify = async (code: string) => {
        try {
            const loginResponse = await handleSpotifyCallback(code);

            await SecureStore.setItemAsync('spotify_jwt', loginResponse.token);
            navigation.navigate('(Home)');
        } catch (error) {
            console.error('Authentication failed:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Text/>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    text: {
        fontSize: 20,
        marginBottom: 10,
    },
});
