import React from 'react';
import { Text, View, SafeAreaView, StyleSheet } from 'react-native';
import { getStoredToken} from "@/scripts/auth/getStoredToken";

export default function Search() {

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text>Search Screen</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff', // Optional: Set background color to match your app's design
    },
    container: {
        flex: 1,
        justifyContent: 'center', // Optional: Center content vertically
        alignItems: 'center', // Optional: Center content horizontally
    },
});
