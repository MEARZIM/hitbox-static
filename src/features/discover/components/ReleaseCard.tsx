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

// Responsive width
const CARD_WIDTH = width * 0.3;

interface ReleaseCardProps {
  item: DiscoverProductItem;
  /** Shows the "NEW" ribbon — on for the New Releases section. */
  showNewBadge?: boolean;
  onPress?: () => void;
}

const ReleaseCard: React.FC<ReleaseCardProps> = ({
  item,
  showNewBadge = true,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{ width: CARD_WIDTH }}
      className="mr-3 overflow-hidden rounded-2xl border border-zinc-800 bg-[#17171C]"
    >
      {/* Square Artwork */}
      <View
        className="relative overflow-hidden bg-[#0E0E12]"
        style={{ aspectRatio: 1 }}
      >
        <Image
          source={{ uri: item.imageUrl ?? DISCOVER_PLACEHOLDER_IMAGE }}
          className="h-full w-full"
          resizeMode="cover"
        />

        {showNewBadge && (
          <View className="absolute left-2 top-2 rounded-full bg-violet-600 px-2 py-1">
            <Text className="text-[9px] font-bold text-white">
              NEW
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className="p-2.5">
        <Text
          numberOfLines={2}
          className="text-[12px] font-bold text-white"
        >
          {item.name}
        </Text>

        <View className="mt-2 flex-row items-center">
          <Gem
            size={11}
            color="#A855F7"
            fill="#A855F7"
          />

          <Text className="ml-1 text-[10px] font-semibold text-violet-400">
            {formatRewardPoints(item.rewardPoints)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ReleaseCard;
