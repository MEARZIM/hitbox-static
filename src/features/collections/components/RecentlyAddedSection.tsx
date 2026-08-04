import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { collectionData } from "../data/CollectionData";
import recentCollections from "../data/Recentsection";
import RecentCards from "./RecentCards";

export default function RecentlyAddedSection() {
  return (
    <View className="mt-8">
      {/* Header */}
      <View className="mb-5 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-white">
            Recently Added
          </Text>

          <Text className="mt-1 text-sm text-zinc-400">
            Latest collectibles in your library
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          className="flex-row items-center"
          onPress={() => router.push("/collections/view-collection")}
        >
          <Text className="mr-1 font-semibold text-violet-500">
            See All
          </Text>

          <ArrowRight
            size={16}
            color="#A855F7"
            strokeWidth={2.5}
          />
        </TouchableOpacity>
      </View>

      {/* Horizontal List */}
      <FlatList
        horizontal
        data={recentCollections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecentCards
            item={item}
            onPress={() => {
              const matched = collectionData.find(
                (c) =>
                  item.subtitle.toLowerCase().includes(c.title.toLowerCase()) ||
                  item.subtitle.toLowerCase().includes(c.subtitle.toLowerCase()) ||
                  c.title.toLowerCase().includes(item.subtitle.toLowerCase()) ||
                  c.subtitle.toLowerCase().includes(item.subtitle.toLowerCase())
              );
              router.push({
                pathname: "/collections/view-collection",
                params: { id: matched ? matched.id : "1" },
              });
            }}
          />
        )}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        contentContainerStyle={{
          paddingBottom: 8,
        }}
      />
    </View>
  );
}