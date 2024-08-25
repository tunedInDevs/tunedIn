import React, {useState, useEffect, useCallback} from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import SearchBar from '../../components/SearchBar';
import TrackItem from '../../components/TrackItem';
import {useFocusEffect} from "@react-navigation/native";

const userId = '31eforplcs33bpa476sc4sdnm6ca'; // Example user ID

export default function Search() {
    const [query, setQuery] = useState('');
    const [tracks, setTracks] = useState<any[]>([]);
    const [ratedTracks, setRatedTracks] = useState<string[]>([]);
    const market = 'US';
    const limit = 20;
    const offset = 0;
    const includeExternal = 'audio';

    const fetchRatedTracks = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/${userId}/rated-tracks`);
            const ratedTrackIds = response.data.map((track: { spotifyTrackId: string }) => track.spotifyTrackId);
            setRatedTracks(ratedTrackIds);
        } catch (error) {
            console.error('Error fetching rated tracks:', error);
        }
    };

    useEffect(() => {
        // Fetch user's rated tracks
        fetchRatedTracks();
    }, []);

    useEffect(() => {
        if (query) {
            const searchTracks = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/api/spotify/search', {
                        params: {
                            userId,
                            query,
                            market,
                            limit,
                            offset,
                            includeExternal
                        }
                    });

                    // No filtering, just set all the tracks returned by the search
                    setTracks(response.data.tracks.items);
                } catch (error) {
                    console.error('Error during search:', error);
                }
            };

            searchTracks();
        }
    }, [query]);

    useFocusEffect(
        useCallback(() => {
            fetchRatedTracks();
        }, [])
    );


    const handleAddTrack = async (trackId: string, rating: number) => {
        try {
            await axios.post(`http://localhost:8080/api/users/${userId}/rated-tracks`, null, {
                params: { spotifyTrackId: trackId }
            });
            console.log('Track added:', trackId);

            // Update the track's rating
            await axios.put(`http://localhost:8080/api/users/${userId}/rated-tracks/${trackId}`, null, {
                params: { rating }
            });
            console.log('Track rating updated:', rating);

            // Update the ratedTracks state
            setRatedTracks((prevRatedTracks) => [...prevRatedTracks, trackId]);

        } catch (error) {
            console.error('Error adding or updating track:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchBarContainer}>
                <SearchBar query={query} setQuery={setQuery} />
            </View>
            <FlatList
                data={tracks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TrackItem
                        id={item.id}
                        title={item.name}
                        artist={item.artists[0].name}
                        albumCover={item.album.images[0].url}
                        duration={item.duration_ms}
                        isAdded={ratedTracks.includes(item.id)}
                        onAddTrack={handleAddTrack}
                    />
                )}
                ListEmptyComponent={<Text>No results found</Text>}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchBarContainer: {
        height: 60, // Fixed height for the search bar
        paddingHorizontal: 16,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    listContent: {
        paddingHorizontal: 16,
    },
});
