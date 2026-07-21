import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { PortalHost } from '@rn-primitives/portal';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // consider data fresh for 1 min
    },
  },
});

function RootNavigator() {
  const { isLoaded, isSignedIn } = useAuth();

  // Wait for Clerk to restore the session before evaluating route guards,
  // otherwise signed-in users get bounced to public routes on cold start.
  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-[#08060b]">
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "#08060b",
        },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      {/* Login/registration is only reachable while signed out */}
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Protected>
      <Stack.Screen
        name="(routes)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="index" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <View className="flex-1">
      <ClerkProvider
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        tokenCache={tokenCache}
      >
        <QueryClientProvider client={queryClient}>
          <RootNavigator />
          <PortalHost />
        </QueryClientProvider>
      </ClerkProvider>
    </View>
  );
}
