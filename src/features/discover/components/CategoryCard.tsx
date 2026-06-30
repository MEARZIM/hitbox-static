import React from "react";
import { Text, TouchableWithoutFeedback, View } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { LucideIcon } from "lucide-react-native";

interface CategoryCardProps {
  title: string;
  Icon: LucideIcon;
  active?: boolean;
  onPress?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  Icon,
  active = false,
  onPress,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 12,
      stiffness: 220,
    });
  };

  const pressOut = () => {
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 220,
    });
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
    >
      <Animated.View
        style={animatedStyle}
        className="mr-3 overflow-hidden rounded-2xl"
      >
        <BlurView
          intensity={30}
          tint="dark"
          className="overflow-hidden rounded-2xl"
        >
          <View
            className={`h-12 flex-row items-center rounded-2xl px-3 ${
              active
                ? "border border-violet-500/50"
                : "border border-white/10"
            }`}
            style={{
              backgroundColor: active
                ? "rgba(168,85,247,0.12)"
                : "rgba(255,255,255,0.04)",
            }}
          >
            {/* Icon */}
            <View
              className={`mr-2 rounded-xl p-2 ${
                active ? "bg-violet-600/20" : "bg-white/5"
              }`}
            >
              <Icon
                size={15}
                color="#A855F7"
                fill={active ? "#A855F7" : "none"}
              />
            </View>

            {/* Text */}
            <Text
              className={`text-[11px] font-semibold ${
                active ? "text-violet-300" : "text-white"
              }`}
            >
              {title}
            </Text>
          </View>
        </BlurView>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default CategoryCard;