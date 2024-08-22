import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SearchBar from '../../components/SearchBar';

export default function Search() {
    const [query, setQuery] = useState('');

    useEffect(() => {
        console.log('Current query:', query);
    }, [query]);

    return (
        <View style={styles.container}>
            <SearchBar query={query} setQuery={setQuery} />
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
