import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import axios from "axios";
import * as Linking from "expo-linking";

export default function Login() {
    const handleLoginPress = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/spotify/login");

            if (response.data) {
                console.log(response.data)
                const spotifyLoginUrl = response.data;
                Linking.openURL(spotifyLoginUrl);
            } else {
                Alert.alert("Error", "Invalid response from server.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            Alert.alert("Login Failed", "Check the console for errors.");
        }
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Pressable
                onPress={handleLoginPress}
                style={({ pressed }) => [
                    {
                        backgroundColor: pressed ? 'lightgray' : 'gray',
                        padding: 10,
                        borderRadius: 5,
                    },
                ]}
            >
                <Text style={{ color: 'white' }}>Login</Text>
            </Pressable>
        </View>
    );
}
