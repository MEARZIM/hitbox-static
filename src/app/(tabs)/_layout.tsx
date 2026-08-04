import { useAuth } from "@clerk/clerk-expo";
import { router, Tabs, usePathname } from "expo-router";
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

/**
 * Tabs that own a nested Stack (`marketplace/[tourId]`,
 * `collections/view-collection`).
 *
 * Pressing the tab you're already on is a no-op by default: React Navigation
 * jumps to an already-focused tab without touching its stack, so a product
 * detail pushed on top of the Marketplace list just stays there and the tab
 * looks broken. These pop the nested stack back to the tab's own root instead.
 *
 * `pathname` is the route as `usePathname()` reports it (group segments
 * stripped); `root` is the href to pop back to.
 */
const NESTED_TABS = {
  collections: { pathname: "/collections", root: "/(tabs)/collections" },
  discover: { pathname: "/discover", root: "/(tabs)/discover" },
  marketplace: { pathname: "/marketplace", root: "/(tabs)/marketplace" },
} as const;

type NestedTab = keyof typeof NESTED_TABS;

const isGated = (name: string): name is GatedTab => name in GATED_TABS;
const isNested = (name: string): name is NestedTab => name in NESTED_TABS;

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

  // Read through a ref inside the listener: React Navigation may keep the
  // handler it was given on mount, and a captured `pathname` would then be
  // frozen at whatever route was open back then.
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  /**
   * One handler for both things a tab press has to cope with:
   *   1. a gated tab pressed while signed out asks for sign-in instead;
   *   2. a tab pressed while one of its nested screens is open returns to that
   *      tab's root screen rather than doing nothing.
   */
  const tabListeners = (name: string) => ({
    tabPress: (e: { preventDefault: () => void }) => {
      if (isGated(name) && !isSignedIn) {
        e.preventDefault();
        targetRef.current = name;
        setGatedTab(name);
        return;
      }

      if (!isNested(name)) return;

      const { pathname: tabPath, root } = NESTED_TABS[name];
      // Only when we're *inside* this tab and deeper than its root — a press
      // from another tab keeps the standard "resume where I was" behaviour.
      if (pathnameRef.current.startsWith(`${tabPath}/`)) {
        e.preventDefault();
        // dismissTo targets the nested stack by href, so it can't accidentally
        // pop the root stack the way an untargeted dismissAll could.
        router.dismissTo(root);
      }
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
            listeners={tabListeners("discover")}
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
            listeners={tabListeners("collections")}
            options={{
              title: "My Collections",
              tabBarIcon: ({ color, size }) => (
                <Box color={color} size={size} />
              ),
            }}
          />

          <Tabs.Screen
            name="marketplace"
            listeners={tabListeners("marketplace")}
            options={{
              title: "Marketplace",
              tabBarIcon: ({ color, size }) => (
                <Handbag color={color} size={size} />
              ),
            }}
          />

          <Tabs.Screen
            name="profile"
            listeners={tabListeners("profile")}
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
