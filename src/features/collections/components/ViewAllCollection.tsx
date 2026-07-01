import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, LayoutDashboard } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

interface Props {
  onPress?: () => void;
}

const AnimatedPressable =
  Animated.createAnimatedComponent(Pressable);

export default function ViewAllCollectionsButton({
  onPress,
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      style={animatedStyle}
      onPressIn={() => {
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <LinearGradient
        colors={["#2B3347", "#1C2333"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 16,
          padding: 1,
        }}
      >
        <View
          className="flex-row items-center border border-[#A855F7] justify-between rounded-[15px] bg-[#0B1018]"
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,

            shadowColor: "#000",
            shadowOpacity: 0.18,
            shadowRadius: 10,
            shadowOffset: {
              width: 0,
              height: 4,
            },
            elevation: 5,
          }}
        >
          {/* Left Side */}
          <View className="flex-row items-center">
            <View
              className="items-center justify-center rounded-lg"
              style={{
                width: 34,
                height: 34,
                backgroundColor: "#151C28",
                borderWidth: 1,
                borderColor: "#283246",

              }}
            >
              <Text
                style={{
                  fontSize: 15,
                }}
              >
                <LayoutDashboard color="#A855F7" size={17} />
              </Text>
            </View>

            <Text
              className="ml-3 font-semibold text-white"
              style={{
                fontSize: 15,
                letterSpacing: 0.3,
              }}
            >
              View All Collections
            </Text>
          </View>

          {/* Arrow */}
          <View
            className="items-center justify-center rounded-full"
            style={{
              width: 30,
              height: 30,
              backgroundColor: "#161D2A",
              borderWidth: 1,
              borderColor: "#2C3650",
            }}
          >
            <ArrowRight
              size={17}
              color="#A855F7"
              strokeWidth={2.4}
            />
          </View>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
}