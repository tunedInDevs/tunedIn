import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import InitialRankingModal from './InitialRankingModal';

interface TrackItemProps {
    id: string;
    title: string;
    artist: string;
    albumCover: string;
    duration: number;  // duration in milliseconds
    isAdded: boolean;
    onAddTrack: (trackId: string, rating: number) => void;
}

const TrackItem: React.FC<TrackItemProps> = ({ id, title, artist, albumCover, duration, isAdded, onAddTrack }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleAddTrack = (rating: number) => {
        onAddTrack(id, rating);
        handleCloseModal();
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: albumCover }} style={styles.albumCover} />
            <View style={styles.info}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.artist}>{artist}</Text>
            </View>
            <View style={styles.details}>
                <Text style={styles.duration}>
                    {minutes}:{seconds < 10 ? '0' : ''}{seconds}
                </Text>
                <View style={styles.divider} />
                {isAdded ? (
                    <MaterialIcons name="check" size={24} color="#1DB954" />
                ) : (
                    <>
                        <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
                            <MaterialIcons name="add" size={24} color="#fff" />
                        </TouchableOpacity>
                        <InitialRankingModal
                            visible={modalVisible}
                            onClose={handleCloseModal}
                            onAddTrack={handleAddTrack}
                        />
                    </>
                )}
            </View>
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
    details: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    duration: {
        fontSize: 14,
        color: '#666',
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: '#ccc',
        marginHorizontal: 10,
    },
    button: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#1DB954',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    artist: {
        fontSize: 14,
        color: '#666',
    },
});

export default TrackItem;
