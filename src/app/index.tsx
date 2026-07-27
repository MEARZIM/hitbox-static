import { useAuth, useClerk } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";

export default function Index() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  return (
    <SafeAreaView className="flex gap-4 mx-4">

      {/* (auth) is guarded by Stack.Protected — only reachable while signed out */}
      {isSignedIn ? (
        <Button onPress={() => signOut()}>
          <Text>
            Sign Out (currently signed in)
          </Text>
        </Button>
      ) : (
        <Button onPress={() => router.push('/(auth)/register')}>
          <Text>
            Go to Auth Section
          </Text>
        </Button>
      )}

      <Button onPress={() => router.push('/(tabs)/discover')}>
        <Text>
          Go to Tabs Section
        </Text>
      </Button>

      {/* NFC section — tap or type a tag id, then Claim or Verify */}
      <Button onPress={() => router.push('/(routes)/scan' as never)}>
        <Text>
          NFC Claim &amp; Verify
        </Text>
      </Button>

      <Button onPress={() => router.push('/(auth)/item-not-authenticated')}>
        <Text>
          Go to Item Not Authentic Section
        </Text>
      </Button>

       <Button onPress={() => router.push('/(auth)/register/step3')}>
        <Text>
          Step - 3
        </Text>
      </Button>
    </SafeAreaView>

  );
}
