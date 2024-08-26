import React from 'react';
import { Modal, SafeAreaView, StyleSheet, Button } from 'react-native';
import { WebView } from 'react-native-webview';

interface WebModalProps {
    url: string;
    visible: boolean;
    onClose: () => void;
}

export default function WebModal({ url, visible, onClose }: WebModalProps) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose} // Close the modal on Android back button press
        >
            <SafeAreaView style={styles.safeArea}>
                <Button title="Close" onPress={onClose} />
                <WebView source={{ uri: url }} style={styles.webview} />
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
