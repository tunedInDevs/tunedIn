import React, { useState } from 'react';
import { View, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebModal from '@/components/WebModal';
import { getSpotifyLoginUrl } from '@/scripts/auth/login';

export default function Login() {
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [authUrl, setAuthUrl] = useState<string | null>(null);
    const navigation = useNavigation();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const url = await getSpotifyLoginUrl();
            setAuthUrl(url);
            setModalVisible(true);
        } catch (error) {
            console.error('Failed to get Spotify login URL:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Button title="Login" onPress={handleLogin} />
                )}
            </View>
            <WebModal
                url={authUrl ?? 'reddit.com'}
                visible={modalVisible}
                onClose={handleCloseModal}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff', // Optional: change this to match your app's background color
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
});
