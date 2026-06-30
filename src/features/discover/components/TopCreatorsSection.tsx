import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  ArrowRight,
  BadgeCheck,
} from "lucide-react-native";

import CreatorCard from "./SingleCreatorCard";
import { creatorsData } from "../data/creatorsData";

interface TopCreatorsSectionProps {
  onSeeAllPress?: () => void;
}

const TopCreatorsSection: React.FC<TopCreatorsSectionProps> = ({
  onSeeAllPress,
}) => {
  const verifiedCreators: any[] = creatorsData.filter(
    (creator) => creator.verified
  );

  return (
    <View className="mt-8">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <View className="flex-row items-center">
            <Text className="text-xl font-bold text-white">
              Top Creators
            </Text>

            <BadgeCheck
              size={18}
              color="#8B5CF6"
              fill="#8B5CF6"
              style={{ marginLeft: 6 }}
            />
          </View>

          <Text className="mt-1 text-xs text-zinc-500">
            Verified creators only
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onSeeAllPress}
          className="flex-row items-center"
        >
          <Text className="mr-1 text-sm font-semibold text-violet-500">
            See All
          </Text>

          <ArrowRight
            size={16}
            color="#8B5CF6"
          />
        </TouchableOpacity>
      </View>

      {/* Verified Creators */}
      <FlatList
        horizontal
        data={verifiedCreators}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CreatorCard item={item} />
        )}
        ItemSeparatorComponent={() => <View className="w-3" />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 8,
          paddingRight: 20,
        }}
      />
    </View>
  );
};

export default TopCreatorsSection;