import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1a365d' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '600' },
        headerBackTitle: 'חזרה',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" options={{ title: 'התחברות', headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'הרשמה', headerShown: false }} />
    </Stack>
  );
}
