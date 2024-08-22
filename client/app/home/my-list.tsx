import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const userId = '31eforplcs33bpa476sc4sdnm6ca';

export default function MyList() {
    const [ratedTracks, setRatedTracks] = useState<any[]>([]);

    useEffect(() => {
        // Fetch the user's rated tracks
        const fetchRatedTracks = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${userId}/rated-tracks`);
                setRatedTracks(response.data);
            } catch (error) {
                console.error('Error fetching rated tracks:', error);
            }
        };

        fetchRatedTracks();
    }, [ratedTracks]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your List</Text>
            <FlatList
                data={ratedTracks}
                keyExtractor={(item, index) => `${index}-${item.spotifyTrackId}`}
                renderItem={({ item, index }) => (
                    <View style={styles.trackItem}>
                        <Text style={styles.trackText}>{index + 1}. {item.spotifyTrackId}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text>Your list is empty</Text>}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
    },
    listContent: {
        paddingBottom: 20,
    },
    trackItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    trackText: {
        fontSize: 16,
    },
});
