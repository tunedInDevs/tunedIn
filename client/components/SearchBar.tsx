import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface SearchBarProps {
    query: string;
    setQuery: (text: string) => void;
}

export default function SearchBar({ query, setQuery }: SearchBarProps) {
    const handleTextChange = (text: string) => {
        setQuery(text);
    };

    return (
        <TextInput
            style={styles.searchBar}
            placeholder="Search..."
            value={query}
            onChangeText={handleTextChange}
        />
    );
}

const styles = StyleSheet.create({
    searchBar: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 8,
        marginBottom: 20,
        width: '100%',
    },
});
