import { Gem } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { DiscoverProductItem } from "../types/discover";
import { DISCOVER_PLACEHOLDER_IMAGE, formatRewardPoints } from "../utils/format";

const { width } = Dimensions.get("window");

// Similar proportions to the design
const CARD_WIDTH = width * 0.36;

interface TrendingCardProps {
  item: DiscoverProductItem;
  index: number;
  onPress?: () => void;
}

const TrendingCard: React.FC<TrendingCardProps> = ({
  item,
  index,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{ width: CARD_WIDTH }}
      className="mr-3 overflow-hidden rounded-[20px] border border-zinc-800 bg-[#111111]"
    >
      {/* Image */}
      <View
        className="relative overflow-hidden bg-[#0E0E12]"
        style={{ aspectRatio: 1 }}
      >
        <Image
          source={{ uri: item.imageUrl ?? DISCOVER_PLACEHOLDER_IMAGE }}
          className="h-full w-full"
          resizeMode="cover"
        />

        {/* Rank Badge */}
        <View className="absolute left-2 top-2 h-6 w-6 items-center justify-center rounded-full bg-black/70">
          <Text className="text-[10px] font-bold text-white">
            {index}
          </Text>
        </View>
      </View>

      {/* Info */}
      <View className="px-3 py-3">
        <Text
          numberOfLines={2}
          className="text-[14px] font-bold text-white"
        >
          {item.name}
        </Text>

        <View className="mt-2 flex-row items-center">
          <Gem
            size={12}
            color="#A855F7"
            fill="#A855F7"
          />

          <Text className="ml-1 text-[11px] font-semibold text-violet-400">
            {formatRewardPoints(item.rewardPoints)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TrendingCard;
