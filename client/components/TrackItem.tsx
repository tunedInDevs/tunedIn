import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface TrackItemProps {
    title: string;
    artist: string;
    albumCover: string;
    duration: number; // duration in milliseconds
}

const TrackItem: React.FC<TrackItemProps> = ({ title, artist, albumCover, duration }) => {
    // Convert duration from milliseconds to mm:ss
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);

    return (
        <View style={styles.container}>
            <Image source={{ uri: albumCover }} style={styles.albumCover} />
            <View style={styles.info}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.artist}>{artist}</Text>
            </View>
            <Text style={styles.duration}>
                {minutes}:{seconds < 10 ? '0' : ''}{seconds}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    albumCover: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    info: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    artist: {
        fontSize: 14,
        color: '#666',
    },
    duration: {
        fontSize: 14,
        color: '#666',
    },
});

export default TrackItem;
