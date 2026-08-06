import {
    ChevronDown,
    SlidersHorizontal,
} from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  selectedSort?: string;
  onSortPress?: () => void;
  onFilterPress?: () => void;
}

const FilterHeader: React.FC<Props> = ({
  selectedSort = "Recent",
  onSortPress,
  onFilterPress,
}) => {
  return (
    <View className="w-full flex-row items-center justify-between">
      {/* Left */}
      <TouchableOpacity
        onPress={onSortPress}
        className="flex-row items-center"
      >
        <Text className="text-white text-[18px] font-semibold">
          {selectedSort}
        </Text>

        <ChevronDown
          size={18}
          color="#9CA3AF"
          style={{ marginLeft: 6 }}
        />
      </TouchableOpacity>

      {/* Right */}
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