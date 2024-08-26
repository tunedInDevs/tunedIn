import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack initialRouteName="Index">
            <Stack.Screen
                name="index"
                options={{ headerShown: false }} // Hides the header on the login screen
            />
            <Stack.Screen
                name="Home"
                options={{ headerShown: false }} // Hides the header on the home screen
            />
            <Stack.Screen
                name="Callback"
                options={{ headerShown: false }} // Hides the header on the callback screen
            />
        </Stack>
    );
}
