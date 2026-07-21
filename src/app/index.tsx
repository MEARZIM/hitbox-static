import { router } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <SafeAreaView className="flex gap-4 mx-4">

      <Button onPress={() => router.push('/(auth)/register')}>
        <Text>
          Go to Auth Section
        </Text>
      </Button>
      <Button onPress={() => router.push('/(tabs)/discover')}>
        <Text>
          Go to Tabs Section
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