import { Clock, Compass, Music, Tag } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MainHeader from "@/components/mainHeader";
import CategoriesSection from "../components/CategoriesSection";
import CollectionGrid from "../components/CollectionGrid";
import CollectionProgress from "../components/CollectionProgress";
import FilterHeader from "../components/FilterHeader";
import MyCollectionData from "../data/MyCollection";

const FILTER_OPTIONS = [
  { label: "Artist", value: "Artist", icon: Music },
  { label: "Brand", value: "Brand", icon: Tag },
  { label: "Genre", value: "Genre", icon: Compass },
  { label: "Latest", value: "Latest", icon: Clock },
];

export default function CollectionScreen() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Latest");

  const filteredData = useMemo(() => {
    if (selectedFilter === "Latest") {
      // Sort by date descending
      return [...MyCollectionData].sort((a, b) => b.date - a.date);
    }
    return MyCollectionData.filter((item) => item.type === selectedFilter);
  }, [selectedFilter]);

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
          className='px-4 py-2'
          variant="compact"
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
        <View className="mx-4 mt-6 gap-4 z-50">
          <FilterHeader onFilterPress={() => setIsFilterOpen(!isFilterOpen)} />

          {isFilterOpen && (
            <View 
              className="absolute right-0 top-10 w-44 bg-[#090D16] border border-[#1E293B] rounded-2xl p-1.5 shadow-2xl z-50"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.5,
                shadowRadius: 20,
                shadowOffset: { width: 0, height: 10 },
                elevation: 10,
              }}
            >
              {FILTER_OPTIONS.map((option) => {
                const IconComponent = option.icon;
                const isSelected = selectedFilter === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => {
                      setSelectedFilter(option.value);
                      setIsFilterOpen(false);
                    }}
                    className={`flex-row items-center px-3.5 py-3 rounded-xl ${
                      isSelected ? "bg-violet-600/15" : "active:bg-zinc-800/20"
                    }`}
                  >
                    <IconComponent
                      size={15}
                      color={isSelected ? "#A78BFA" : "#94A3B8"}
                    />
                    <Text
                      className={`ml-3 font-semibold text-xs ${
                        isSelected ? "text-violet-300" : "text-zinc-400"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <CollectionGrid data={filteredData} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}