import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { BadgeCheck } from "lucide-react-native";


interface CreatorCardProps {
  item: {
    id: string; 
    name: string;
    username: string;
    followers: string;
    verified: boolean;
    image: string;
  }
}


export default function SingleCreatorCard({ item } : CreatorCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="w-32 overflow-hidden rounded-3xl"
    >
      <BlurView
        intensity={10}
        tint="dark"
        className="overflow-hidden rounded-3xl"
      >
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
          }}
          className="items-center rounded-3xl px-3 py-5"
        >
          {/* Avatar */}
          <Image
            source={{ uri: item.image }}
            className="h-20 w-20 rounded-full border-2 border-zinc-600"
            resizeMode="cover"
          />

          {/* Name */}
          <View className="mt-3 flex-row items-center">
            <Text
              numberOfLines={1}
              className="text-sm font-bold text-white"
            >
              {item.name}
            </Text>

            {item.verified && (
              <BadgeCheck
                size={13}
                color="#A855F7"
                fill="#A855F7"
                style={{ marginLeft: 4 }}
              />
            )}
          </View>

          {/* Username */}
          <Text
            numberOfLines={1}
            className="mt-1 text-[11px] text-zinc-400"
          >
            @{item.username}
          </Text>

          {/* Followers */}
          <Text className="mt-1 text-[11px] text-zinc-500">
            {item.followers} followers
          </Text>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}