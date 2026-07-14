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
    </SafeAreaView>

  );
}