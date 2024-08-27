import React from 'react';
import { Modal, SafeAreaView, StyleSheet, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

interface WebModalProps {
    url: string;
    visible: boolean;
    onClose: () => void;
}

export default function WebModal({ url, visible, onClose }: WebModalProps) {
    const navigation = useNavigation();

    const handleNavigationStateChange = (navState: any) => {
        const { url: currentUrl } = navState;
        // Check if the current URL matches the callback URL
        if (currentUrl.includes('/callback?code=')) {  // Adjust 'yourapp://callback' to your actual callback scheme
            // Extract the 'code' parameter from the URL
            const urlParams = new URLSearchParams(new URL(currentUrl).search);
            const codeParam = urlParams.get('code');

            // Close the modal
            onClose();

            // Navigate to the Callback screen with the code parameter
            if (codeParam) {
                // @ts-ignore
                navigation.navigate('callback', { code: codeParam });
            }
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose} // Close the modal on Android back button press
        >
            <SafeAreaView style={styles.safeArea}>
                <Button title="Close" onPress={onClose} />
                <WebView
                    source={{ uri: url }}
                    style={styles.webview}
                    onNavigationStateChange={handleNavigationStateChange}
                />
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff', // Optional: change this to match your app's background color
    },
    webview: {
        flex: 1,
    },
});
