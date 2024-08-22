import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import SearchBar from '../../components/SearchBar';
import TrackItem from '../../components/TrackItem';

const userId = '31eforplcs33bpa476sc4sdnm6ca'; // Example user ID

export default function Search() {
    const [query, setQuery] = useState('');
    const [tracks, setTracks] = useState<any[]>([]);
    const [ratedTracks, setRatedTracks] = useState<string[]>([]);
    const market = 'US';
    const limit = 20;
    const offset = 0;
    const includeExternal = 'audio';

    useEffect(() => {
        // Fetch user's rated tracks
        const fetchRatedTracks = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${userId}/rated-tracks`);
                const ratedTrackIds = response.data.map((track: { spotifyTrackId: string }) => track.spotifyTrackId);
                setRatedTracks(ratedTrackIds);
            } catch (error) {
                console.error('Error fetching rated tracks:', error);
            }
        };
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

                    // Filter out tracks that are already in the ratedTracks list
                    const filteredTracks = response.data.tracks.items.filter(
                        (track: { id: string }) => !ratedTracks.includes(track.id)
                    );

                    setTracks(filteredTracks);
                } catch (error) {
                    console.error('Error during search:', error);
                }
            };

            searchTracks();
        }
    }, [query, ratedTracks]);

    const handleAddTrack = async (trackId: string) => {
        try {
            await axios.post(`http://localhost:8080/api/users/${userId}/rated-tracks`, null, {
                params: { spotifyTrackId: trackId }
            });
            console.log('Track added:', trackId);

            // Properly update the ratedTracks state
            setRatedTracks((prevRatedTracks) => [...prevRatedTracks, trackId]);

            // Optional: Log the updated state right after setting it
            console.log('Updated ratedTracks:', [...ratedTracks, trackId]);
        } catch (error) {
            console.error('Error adding track:', error);
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
