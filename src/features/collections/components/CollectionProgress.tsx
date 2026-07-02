import { ArrowRight } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

interface CollectionProgressProps {
  progress?: number; // e.g. 32 for 32%
  itemsOwned?: number;
  totalCollections?: number;
  rewardsCount?: number;
  onViewRewardsPress?: () => void;
}

export default function CollectionProgress({
  progress = 32,
  itemsOwned = 42,
  totalCollections = 8,
  rewardsCount = 5,
  onViewRewardsPress = () => console.log("View Rewards"),
}: CollectionProgressProps) {
  // Circular progress calculations
  const size = 68;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2; // 31
  const circumference = 2 * Math.PI * radius; // ~194.78
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View
      className="border border-[#1E293B] bg-[#090D16] p-4 rounded-3xl"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowOffset: {
          width: 0,
          height: 8,
        },
        elevation: 8,
      }}
    >
      {/* Top Section: Progress & Stats */}
      <View className="flex-row items-center justify-between">
        {/* Left Side: Progress Ring & Title */}
        <View className="flex-row items-center flex-1 mr-4">
          {/* Progress Ring */}
          <View className="items-center justify-center" style={{ width: size, height: size }}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <Defs>
                <LinearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#A855F7" />
                  <Stop offset="100%" stopColor="#7C3AED" />
                </LinearGradient>
              </Defs>
              {/* Background Circle */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#17122C"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Active Circle */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="url(#progressGrad)"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </Svg>
            {/* Center Percentage Text */}
            <View className="absolute">
              <Text className="text-white text-sm font-bold">{progress}%</Text>
            </View>
          </View>

          {/* Title and Description */}
          <View className="ml-3 flex-1">
            <Text className="text-white text-[15px] font-bold">
              Collection Progress
            </Text>
            <Text className="text-zinc-400 text-[10px] mt-0.5 leading-4" numberOfLines={2}>
              Keep collecting to complete sets and unlock exclusive rewards.
            </Text>
          </View>
        </View>

        {/* Right Side: Stats Panel */}
        <View className="flex-row items-center gap-3">
          {/* Items Owned */}
          <View className="items-center">
            <Text className="text-white text-lg font-bold">{itemsOwned}</Text>
            <Text className="text-zinc-400 text-[8px] mt-0.5 font-medium">Items Owned</Text>
          </View>

          {/* Divider */}
          <View style={{ width: 1, height: 24, backgroundColor: "#1E293B" }} />

          {/* Collections */}
          <View className="items-center">
            <Text className="text-white text-lg font-bold">{totalCollections}</Text>
            <Text className="text-zinc-400 text-[8px] mt-0.5 font-medium">Collections</Text>
          </View>

          {/* Divider */}
          <View style={{ width: 1, height: 24, backgroundColor: "#1E293B" }} />

          {/* Rewards */}
          <View className="items-center">
            <Text className="text-white text-lg font-bold">{rewardsCount}</Text>
            <Text className="text-zinc-400 text-[8px] mt-0.5 font-medium">Rewards</Text>
          </View>
        </View>
      </View>

      {/* Bottom Section: View Rewards link */}
      <View className="flex-row justify-end mt-3">
        <TouchableOpacity
          onPress={onViewRewardsPress}
          className="flex-row items-center"
          activeOpacity={0.8}
        >
          <Text className="text-violet-400 text-xs font-semibold mr-1">
            View Rewards
          </Text>
          <ArrowRight size={13} color="#A78BFA" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
