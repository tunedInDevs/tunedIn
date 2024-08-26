import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function Callback() {
    const [code, setCode] = useState<string | null>(null);

    useEffect(() => {
        // Get the current URL
        const url = window.location.href;

        // Parse the URL and get the 'code' parameter
        const urlParams = new URLSearchParams(new URL(url).search);
        const codeParam = urlParams.get('code');

        if (codeParam) {
            setCode(codeParam);
            console.log('Received code:', codeParam);
        } else {
            console.log('No code received');
        }

        // You can navigate to the Home screen after processing the code
        // navigation.navigate('(Home)');
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Callback Screen</Text>
            {code ? (
                <Text style={styles.codeText}>Code: {code}</Text>
            ) : (
                <Text style={styles.codeText}>No code received</Text>
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
    codeText: {
        fontSize: 16,
        color: 'blue',
    },
});
