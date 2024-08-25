import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import TrackItemWithDelete from '../../components/TrackItemWithDelete'; // Import the TrackItemWithDelete component

const userId = '31eforplcs33bpa476sc4sdnm6ca';

export default function MyList() {
    const [ratedTracks, setRatedTracks] = useState<any[]>([]);

    const fetchRatedTracks = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/${userId}/rated-tracks`);
            const ratedTracksData = response.data;

            const trackDetailsPromises = ratedTracksData.map((track: { spotifyTrackId: string, rating: number }) =>
                axios.get(`http://localhost:8080/api/spotify/track/${track.spotifyTrackId}`, {
                    params: { userId }
                }).then(response => ({
                    ...response.data,
                    rating: track.rating  // Add the rating to the track details
                }))
            );

            const fullTrackDetails = await Promise.all(trackDetailsPromises);
            setRatedTracks(fullTrackDetails);
        } catch (error) {
            console.error('Error fetching rated tracks:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchRatedTracks();
        }, [])
    );

    const handleDeleteTrack = async (trackId: string) => {
        try {
            await axios.delete(`http://localhost:8080/api/users/${userId}/rated-tracks/${trackId}`);
            console.log(`Deleted track with ID: ${trackId}`);

            setRatedTracks((prevTracks) => prevTracks.filter(track => track.id !== trackId));
        } catch (error) {
            console.error('Error deleting track:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your List</Text>
            <FlatList
                data={ratedTracks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TrackItemWithDelete
                        id={item.id}
                        title={item.name}
                        artist={item.artists[0].name}
                        albumCover={item.album.images[0].url}
                        duration={item.duration_ms}
                        rating={item.rating}  // Pass the rating to the component
                        onDeleteTrack={handleDeleteTrack}
                    />
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
});
