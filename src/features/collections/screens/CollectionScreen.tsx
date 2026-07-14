import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MainHeader from "@/components/mainHeader";
import CategoriesSection from "../components/CategoriesSection";
import CollectionGrid from "../components/CollectionGrid";
import CollectionProgress from "../components/CollectionProgress";
import FilterHeader from "../components/FilterHeader";
import RecentlyAddedSection from "../components/RecentlyAddedSection";
import ViewAllCollectionsButton from "../components/ViewAllCollection";
import MyCollectionData from "../data/MyCollection";

export default function CollectionScreen() {

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <MainHeader
          title="My Collection"
          subtitle="Welcome to your HitBox collection."
          notificationCount={3}
          onNotificationPress={() => console.log("Notifications")}
          onFilterPress={() => console.log("Filter")}
          classname="mx-4 py-2"
        />

        {/* Collection Progress */}
        <View className="mx-4 mt-4">
          <CollectionProgress />
        </View>

        {/* Categories */}
        <View className="mx-4 mt-6">
          <CategoriesSection />
        </View>

        {/* My Collections */}
        <View className="mx-4 mt-6 gap-4">
          <FilterHeader />

          {/* Show only first 6 collections */}
          <CollectionGrid data={MyCollectionData.slice(0, 6)} />

          <ViewAllCollectionsButton
            onPress={() => console.log("View All Collections")}
          />
        </View>

        {/* Recently Added */}
        <View className="mx-4 mt-8">
          <RecentlyAddedSection />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}