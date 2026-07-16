import { useAuth } from "@clerk/clerk-expo";
import { Tabs } from "expo-router";
import { Box, Compass, Handbag, User } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  const { isSignedIn } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 80,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: "#000000"
        },
        tabBarActiveTintColor: "#6C5CE7",
        tabBarInactiveTintColor: "#999",
      }}
    >
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, size }) => (
            <Compass color={color} size={size} />
          ),
        }}
      />

      {/* Private: only visible and reachable for signed-in users */}
      <Tabs.Protected guard={!!isSignedIn}>
        <Tabs.Screen
          name="collections"
          options={{
            title: "Collections",
            tabBarIcon: ({ color, size }) => (
              <Box color={color} size={size} />
            ),
          }}
        />
      </Tabs.Protected>

      <Tabs.Screen
        name="marketplace"
        options={{
          title: "Marketplace",
          tabBarIcon: ({ color, size }) => (
            <Handbag color={color} size={size} />
          ),
        }}
      />

      <Tabs.Protected guard={!!isSignedIn}>
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <User color={color} size={size} />
            ),
          }}
        />
      </Tabs.Protected>
    </Tabs>
  );
}