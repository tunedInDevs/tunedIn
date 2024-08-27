import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SongItem from './SongItem';

interface SearchResultItemProps {
    song: {
        id: string;
        name: string;
        artists: Array<{ name: string }>;
        album: { images: Array<{ url: string }> };
        duration_ms: number;
    };
    onAddToList: (songId: string) => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ song, onAddToList }) => {
    return (
        <View style={styles.container}>
            <View style={styles.songItemContainer}>
                <SongItem
                    title={song.name}
                    artist={song.artists.map(artist => artist.name).join(', ')}
                    albumCover={song.album.images[0]?.url || ''}
                    duration={song.duration_ms}
                />
            </View>
            <View style={styles.actionsContainer}>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.addButton} onPress={() => onAddToList(song.id)}>
                    <MaterialIcons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16, // Added horizontal padding to prevent cut-off
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    songItemContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    divider: {
        width: 1,
        height: '80%', // Adjusted height to better fit within the container
        backgroundColor: '#ccc',
        marginHorizontal: 10,
    },
    addButton: {
        width: 30,
        height: 30,
        borderRadius: 18,
        backgroundColor: '#1DB954', // Spotify green
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SearchResultItem;
