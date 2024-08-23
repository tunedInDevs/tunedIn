import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

interface InitialRankingModalProps {
    visible: boolean;
    onClose: () => void;
    onAddTrack: (rating: number) => void;
}

const InitialRankingModal: React.FC<InitialRankingModalProps> = ({ visible, onClose, onAddTrack }) => {
    const [rating, setRating] = useState<string>('');

    const handleAddClick = () => {
        if (rating) {
            onAddTrack(Number(rating));
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Initial Ranking</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter rating (1-10)"
                        keyboardType="numeric"
                        value={rating}
                        onChangeText={setRating}
                    />
                    <TouchableOpacity
                        style={[styles.addButton, !rating && styles.disabledButton]}
                        onPress={handleAddClick}
                        disabled={!rating}
                    >
                        <Text style={styles.addButtonText}>Add to List</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
    },
    addButton: {
        backgroundColor: '#1DB954',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    disabledButton: {
        backgroundColor: '#888', // Gray out the button when disabled
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default InitialRankingModal;
