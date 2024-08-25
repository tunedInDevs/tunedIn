import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="Login"
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
