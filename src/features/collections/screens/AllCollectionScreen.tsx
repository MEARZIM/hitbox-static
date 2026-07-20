import React from "react";
import { ScrollView, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import MainHeader from "../../../components/mainHeader";
import CollectionGrid from "../components/CollectionGrid";
import MyCollections from "../data/MyCollection";

export default function AllCollectionsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#070B14]">
      <MainHeader title="All Collections" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 24,
        }}
      >
        <View className="px-4 mt-4">
          <Text className="text-white text-2xl font-bold">
            Collections
          </Text>

          <Text className="text-zinc-400 mt-1">
            Browse every available collection
          </Text>
        </View>

        <View className="mx-4 mt-6">
          <CollectionGrid data={MyCollections} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}