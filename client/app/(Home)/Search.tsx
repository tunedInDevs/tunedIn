import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, TextInput, FlatList } from 'react-native';
import { searchSpotify } from '@/scripts/spotify/searchSpotify'; // Adjust the import path as necessary
import SearchResultItem from '@/components/SearchResultItem';
import { addRatedTrack } from '@/scripts/me/addRatedTrack';

export default function Search() {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    useEffect(() => {
        if (query.length > 0) {
            const fetchResults = async () => {
                try {
                    const response = await searchSpotify(query, 'track');
                    setSearchResults(response.tracks?.items || []);
                } catch (error) {
                    console.error('Search failed:', error.message);
                }
            };

            fetchResults();
        } else {
            setSearchResults([]); // Clear results when query is empty
        }
    }, [query]);

    const handleAddToList = async (songId: string) => {
        try {
            const initialRating = 5.0; // Or get this value from user input if needed
            await addRatedTrack(songId, initialRating);
            console.log('Track added to list:', songId);
            // Optionally update the state or show a confirmation to the user
        } catch (error) {
            console.error('Failed to add track to list:', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for songs"
                    value={query}
                    onChangeText={setQuery}
                />
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <SearchResultItem song={item} onAddToList={handleAddToList} />
                    )}
                    contentContainerStyle={styles.resultsContainer}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    resultsContainer: {
        paddingBottom: 16, // Add some padding to the bottom
    },
});
