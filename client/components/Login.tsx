import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebModal from "@/components/WebModal";

export default function Index() {
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    const handleLogin = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        // You can navigate to (Home) after the modal is closed if needed
        navigation.navigate('(Home)');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Button title="Login" onPress={handleLogin} />
            </View>
            <WebModal
                url="https://www.pornhub.com" // Replace this with your Spotify URL later
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
