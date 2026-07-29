import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import React from "react";

/**
 * App entry point — renders nothing of its own, it just decides where a cold
 * start lands:
 *
 *   signed in  → `/(tabs)/discover`
 *   signed out → `/(auth)/register`
 *
 * `_layout.tsx` already holds the navigator back until Clerk has restored the
 * session, so `isSignedIn` is settled by the time this renders. The `isLoaded`
 * check is only here so this screen stays correct if that gate ever moves.
 */
export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;

  return <Redirect href={isSignedIn ? "/(tabs)/discover" : "/(auth)/register"} />;
}
