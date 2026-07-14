import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MainHeader from '@/components/mainHeader';

export default function Collections() {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <MainHeader
          title="Collections"
          subtitle="View and manage your personal collections."
          classname="py-2 px-4"
        />
        <View className="mt-8 mx-4">
          <Text className="text-gray-400">No collections found.</Text>
        </View>
      </ScrollView>
    </View>
  );
}