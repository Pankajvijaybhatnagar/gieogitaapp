import { Stack } from 'expo-router';

export default function LoginLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* This will apply to all screens within the login folder */}
      <Stack.Screen name="index" />
      {/* Add any other routes you want */}
    </Stack>
  );
}
