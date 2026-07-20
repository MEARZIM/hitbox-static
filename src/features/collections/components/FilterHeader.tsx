import { Settings, SlidersHorizontal } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  onFilterPress?: () => void;
  onSettingsPress?: () => void;
}

const FilterHeader: React.FC<Props> = ({
  onFilterPress,
  onSettingsPress,
}) => {
  return (
    <View className="w-full flex-row items-center justify-between">
      {/* Left: collection settings */}
      <TouchableOpacity
        onPress={onSettingsPress}
        activeOpacity={0.8}
        className="h-10 w-10 items-center justify-center rounded-full bg-[#18181B] border border-[#1E293B]"
      >
        <Settings size={18} color="#94A3B8" strokeWidth={2} />
      </TouchableOpacity>

      {/* Right: filter dropdown trigger */}
      <TouchableOpacity
        onPress={onFilterPress}
        className="flex-row items-center"
      >
        <SlidersHorizontal size={18} color="#FFFFFF" />

        <Text className="ml-2 text-white text-[18px] font-semibold">
          Filter
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FilterHeader;
