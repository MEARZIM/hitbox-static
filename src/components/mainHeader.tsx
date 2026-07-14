import { cn } from "@/lib/utils";
import { Bell, SlidersHorizontal } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";

interface MainHeaderProps {
  title: string;
  subtitle?: string | null;
  notificationCount?: number | null;
  onNotificationPress?: (() => void) | null;
  onFilterPress?: (() => void) | null;
  showFilter?: boolean;
  classname?: string
}

const MainHeader: React.FC<MainHeaderProps> = ({
  title,
  subtitle,
  notificationCount = 0,
  onNotificationPress,
  onFilterPress,
  showFilter = false,
  classname
}) => {
  return (
    <View className={cn(`flex-col gap-4`, classname)}>
      {/* Top brand bar: Centered HitBox Logo */}
      <View className="w-full items-center justify-center">
        <Image
          source={require("@/assets/images/HitBoxLogo.jpeg")}
          className="h-10 w-32 rounded-lg"
          resizeMode="contain"
        />
      </View>

      {/* Second row: Headline (Left) & Controls (Right) */}
      <View className="flex-row items-start justify-between">
        {/* Left side: Headline & Subtitle */}
        <View className="flex-1 pr-4">
          <Text className="text-3xl font-bold text-white">
            {title}
          </Text>

          {subtitle && (
            <Text className="mt-1 text-[12px] leading-4 text-gray-400">
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right side: Filter & Notification Bell */}
        <View className="flex-row items-center gap-3">
          {showFilter && (
            <TouchableOpacity
              onPress={onFilterPress ?? undefined}
              className="h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-[#121218]"
            >
              <SlidersHorizontal size={20} color="white" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={onNotificationPress ?? undefined}
            className="relative h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-[#121218]"
          >
            <Bell size={20} color="white" />

            {(notificationCount ?? 0) > 0 && (
              <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-violet-600">
                <Text className="text-[10px] font-bold text-white">
                  {notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MainHeader;