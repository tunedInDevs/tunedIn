import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="login"
                options={{ headerShown: false }} // Hides the header on the login screen
            />
            <Stack.Screen
                name="home"
                options={{ headerShown: false }} // Hides the header on the home screen
            />
        </Stack>
    );
}
