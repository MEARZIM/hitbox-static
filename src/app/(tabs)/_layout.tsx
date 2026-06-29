import { Tabs } from "expo-router";
import { User } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
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
      {/* <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, size }) => (
            <Compass color={color} size={size} />
          ),
        }}
      /> */}

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}