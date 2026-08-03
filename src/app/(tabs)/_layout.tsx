import { useAuth } from "@clerk/clerk-expo";
import { router, Tabs } from "expo-router";
import { Box, Compass, Handbag, User } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SignInPopup from "@/components/auth/SignInPopup";
import { TabBarBaseHeight } from "@/constants/theme";

/**
 * Tabs whose screens can't work without a Clerk session. They stay **visible**
 * while signed out so a guest can see what the app offers; pressing one opens
 * the sign-in popup instead of loading the screen, and the press is replayed
 * once a session exists.
 */
const GATED_TABS = {
  collections: {
    href: "/(tabs)/collections",
    title: "Sign in to see your collection",
    description:
      "Every item you claim lands in your collection. Sign in to open it.",
  },
  profile: {
    href: "/(tabs)/profile",
    title: "Sign in to view your profile",
    description: "Sign in to manage your HitBox profile, rewards and settings.",
  },
} as const;

type GatedTab = keyof typeof GATED_TABS;

export default function TabLayout() {
  const { isSignedIn } = useAuth();
  // Android's gesture/3-button nav bar sits on top of the tab bar otherwise:
  // a fixed `height` + `paddingBottom` overrides the inset handling that
  // React Navigation would normally apply for us.
  const insets = useSafeAreaInsets();

  const [gatedTab, setGatedTab] = useState<GatedTab | null>(null);
  // The popup closes itself before calling onSignedIn, so the target is read
  // from a ref rather than from state that is already being cleared.
  const targetRef = useRef<GatedTab | null>(null);

  /** Swallows the press on a gated tab and asks for sign-in instead. */
  const guard = (name: GatedTab) => ({
    tabPress: (e: { preventDefault: () => void }) => {
      if (isSignedIn) return;
      e.preventDefault();
      targetRef.current = name;
      setGatedTab(name);
    },
  });

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: TabBarBaseHeight + insets.bottom,
            paddingBottom: 2,
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

          {/* Private, but still listed when signed out — see GATED_TABS */}
          <Tabs.Screen
            name="collections"
            listeners={guard("collections")}
            options={{
              title: "My Collections",
              tabBarIcon: ({ color, size }) => (
                <Box color={color} size={size} />
              ),
            }}
          />

          <Tabs.Screen
            name="marketplace"
            options={{
              title: "Marketplace",
              tabBarIcon: ({ color, size }) => (
                <Handbag color={color} size={size} />
              ),
            }}
          />

          <Tabs.Screen
            name="profile"
            listeners={guard("profile")}
            options={{
              title: "Profile",
              tabBarIcon: ({ color, size }) => (
                <User color={color} size={size} />
              ),
            }}
          />
      </Tabs>
      <SignInPopup
        open={!!gatedTab}
        onOpenChange={(open) => {
          if (!open) setGatedTab(null);
        }}
        title={gatedTab ? GATED_TABS[gatedTab].title : undefined}
        description={gatedTab ? GATED_TABS[gatedTab].description : undefined}
        // Signed in → open the tab the user pressed in the first place.
        onSignedIn={() => {
          const target = targetRef.current;
          targetRef.current = null;
          setGatedTab(null);
          if (target) router.push(GATED_TABS[target].href);
        }}
      />

    </>
  );
}
