import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '@store/auth-store';
import { LoadingScreen } from '@components/LoadingScreen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

/**
 * Handles auth-based navigation:
 * - If not authenticated → redirect to /(auth)/login
 * - If authenticated & on auth screens → redirect to /(tabs)
 */
function useProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = (segments[0] as string) === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login' as never);
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);
}

function AppContent() {
  const { isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  useProtectedRoute();

  if (isLoading) {
    return <LoadingScreen message="טוען..." />;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
