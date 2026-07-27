import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { router, Stack } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { View } from 'react-native';

import { PortalHost } from '@rn-primitives/portal';
import { registerAuthTokenGetter } from '@/lib/api';
import { initNfc, promptEnableNfcIfNeeded, startTagListener } from '@/lib/nfc';
import '../global.css';

// Completes the OAuth web session when the browser redirects back into the app.
WebBrowser.maybeCompleteAuthSession();

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

function AppShell() {
  const { getToken } = useAuth();

  // Bridge Clerk's session token into the plain (non-hook) api client.
  useEffect(() => {
    registerAuthTokenGetter(async () => {
      try {
        return await getToken();
      } catch {
        return null;
      }
    });
  }, [getToken]);

  // On app open: ensure NFC is on (prompt if not), then route any tapped tag
  // to the claim page.
  useEffect(() => {
    let stop = () => {};
    void (async () => {
      await initNfc();
      await promptEnableNfcIfNeeded();
      stop = startTagListener((tagId) => {
        router.push(`/(routes)/claim/${tagId}` as never);
      });
    })();
    return () => stop();
  }, []);

  return (
    <View className="flex-1">
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#08060b' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(routes)" options={{ headerShown: false }} />
        <Stack.Screen name="sso-callback" />
        <Stack.Screen name="index" />
      </Stack>
      <PortalHost />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <AppShell />
    </ClerkProvider>
  );
}
