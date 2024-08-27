import React, { useState, useCallback } from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { getUserRatedTracks } from '@/scripts/me/getUserRatedTracks';
import { removeRatedTrack } from '@/scripts/me/removeRatedTracks';
import ListItem from '@/components/ListItem';

export default function List() {
    const [ratedTracks, setRatedTracks] = useState<any[]>([]);

    const fetchRatedTracks = async () => {
        try {
            const tracks = await getUserRatedTracks();
            setRatedTracks(tracks);
        } catch (error) {
            console.error('Failed to fetch rated tracks:', error.message);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchRatedTracks(); // Refetch the list whenever the screen comes into focus
        }, [])
    );

    const handleDeleteItem = async (trackId: string) => {
        try {
            await removeRatedTrack(trackId);
            await fetchRatedTracks(); // Refetch the list after deletion
        } catch (error) {
            console.error('Failed to delete track:', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                data={ratedTracks}
                keyExtractor={(item) => item.track.id}
                renderItem={({ item }) => (
                    <ListItem song={item} handleDeleteItem={handleDeleteItem} />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Your list is empty</Text>}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContent: {
        padding: 16,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        color: '#666',
    },
});
