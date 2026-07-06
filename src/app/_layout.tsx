import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { PortalHost } from '@rn-primitives/portal';
import '../global.css';

export default function RootLayout() {
  return (
    <View className="flex-1">
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
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(routes)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="index" />
      </Stack>
      <PortalHost />
    </View>
  );
}
