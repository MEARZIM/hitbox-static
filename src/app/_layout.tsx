import { Stack } from 'expo-router';
import React from 'react';

import '../global.css';

export default function RootLayout() {
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
  );
}
