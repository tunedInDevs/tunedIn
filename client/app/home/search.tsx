import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import SearchBar from '../../components/SearchBar';

export default function Search() {
    const userId = "sinistercode"
    const [query, setQuery] = useState('');
    const market = 'US';  // Default market value, you can change this or make it dynamic
    const limit = 5;     // Default limit value, you can change this or make it dynamic
    const offset = 0;     // Default offset value, you can change this or make it dynamic
    const includeExternal = 'audio';  // Default includeExternal value, you can change this or make it dynamic

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
                    console.log('Search Response:', response.data);
                } catch (error) {
                    console.error('Error during search:', error);
                }
            };

            searchTracks();
        }
    }, [query]);

    return (
        <View style={styles.container}>
            <SearchBar query={query} setQuery={setQuery} />
            <Text>Search Page</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
});
