import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Heart } from "lucide-react-native";

const { width } = Dimensions.get("window");

// Responsive width
const CARD_WIDTH = width * 0.3;

export interface Release {
  id: string;
  title: string;
  artist: string;
  image: string;
  release: string;
  likes: string | number;
}

interface ReleaseCardProps {
  item: Release;
  onPress?: () => void;
}

const ReleaseCard: React.FC<ReleaseCardProps> = ({
  item,
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
          source={{ uri: item.image }}
          className="h-full w-full"
          resizeMode="cover"
        />

        {/* NEW Badge */}
        <View className="absolute left-2 top-2 rounded-full bg-violet-600 px-2 py-1">
          <Text className="text-[9px] font-bold text-white">
            NEW
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="p-2.5">
        <Text
          numberOfLines={1}
          className="text-[12px] font-bold text-white"
        >
          {item.title}
        </Text>

        <Text
          numberOfLines={1}
          className="mt-1 text-[10px] text-zinc-400"
        >
          {item.artist}
        </Text>

        <View className="mt-2 flex-row items-center justify-between">
          <Text className="text-[9px] text-zinc-500">
            {item.release}
          </Text>

          <View className="flex-row items-center">
            <Heart
              size={11}
              color="#A855F7"
              fill="#A855F7"
            />

            <Text className="ml-1 text-[10px] font-semibold text-violet-400">
              {item.likes}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ReleaseCard;