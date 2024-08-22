import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import SearchBar from '../../components/SearchBar';
import TrackItem from '../../components/TrackItem';

export default function Search() {
    const [query, setQuery] = useState('');
    const [tracks, setTracks] = useState<any[]>([]);
    const market = 'US';
    const limit = 20;
    const offset = 0;
    const includeExternal = 'audio';

    useEffect(() => {
        if (query) {
            const searchTracks = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/api/spotify/search', {
                        params: {
                            userId: '31eforplcs33bpa476sc4sdnm6ca',
                            query,
                            market,
                            limit,
                            offset,
                            includeExternal
                        }
                    });
                    console.log('Search Response:', response.data.tracks.items);
                    setTracks(response.data.tracks.items);
                } catch (error) {
                    console.error('Error during search:', error);
                }
            };

            searchTracks();
        }
    }, [query]);

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
                        title={item.name}
                        artist={item.artists[0].name}
                        albumCover={item.album.images[0].url}
                        duration={item.duration_ms}
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
