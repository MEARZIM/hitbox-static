import { cn } from "@/lib/utils";
import { Bell, SlidersHorizontal } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface MainHeaderProps {
  title: string;
  subtitle?: string | null;
  notificationCount?: number | null;
  onNotificationPress?: (() => void) | null;
  onFilterPress?: (() => void) | null;
  classname?: string
}

const MainHeader: React.FC<MainHeaderProps> = ({
  title,
  subtitle,
  notificationCount = 0,
  onNotificationPress,
  onFilterPress,
  classname
}) => {
  return (
    <View className={cn(`flex-row items-start justify-between`, classname)}>
      {/* Left */}
      <View className="flex-1 pr-4">
        <Text className="text-3xl font-bold text-white">
          {title}
        </Text>

        {subtitle && (
          <Text className="mt-2 text-[12px] leading-4 text-gray-400">
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right */}
      <View className="flex-row gap-3">
        {/* Notification */}
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

        {/* Filter */}
        <TouchableOpacity
          onPress={onFilterPress ?? undefined}
          className="h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-[#121218]"
        >
          <SlidersHorizontal size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MainHeader;