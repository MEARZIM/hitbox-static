import { SlidersHorizontal } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  onFilterPress?: () => void;
}

const FilterHeader: React.FC<Props> = ({
  onFilterPress,
}) => {
  return (
    <View className="w-full flex-row items-center justify-end">
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