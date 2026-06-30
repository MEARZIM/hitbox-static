import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Gem } from "lucide-react-native";

const { width } = Dimensions.get("window");

// Similar proportions to the design
const CARD_WIDTH = width * 0.36;

export interface TrendingItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  price: string;
}

interface TrendingCardProps {
  item: TrendingItem;
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
          source={{ uri: item.image }}
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
          numberOfLines={1}
          className="text-[14px] font-bold text-white"
        >
          {item.title}
        </Text>

        <Text
          numberOfLines={1}
          className="mt-1 text-[11px] text-zinc-400"
        >
          {item.subtitle}
        </Text>

        <View className="mt-2 flex-row items-center">
          <Gem
            size={12}
            color="#A855F7"
            fill="#A855F7"
          />

          <Text className="ml-1 text-[11px] font-semibold text-violet-400">
            {item.price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TrendingCard;