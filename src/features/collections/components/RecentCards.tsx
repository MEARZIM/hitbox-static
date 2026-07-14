import { LinearGradient } from "expo-linear-gradient";
import { Check } from "lucide-react-native";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable =
  Animated.createAnimatedComponent(Pressable);

interface RecentCardsProps {
  item: {
    id: string;
    title: string;
    subtitle: string;
    image: ImageSourcePropType;
    rarity: string;
    isNew: boolean;
    owned: boolean;
  };
  onPress?: () => void;
}

const rarityStyles = (rarity: string) => {
  switch (rarity) {
    case "Epic":
      return {
        bg: "rgba(236, 72, 153, 0.15)",
        text: "#EC4899",
      };
    case "Rare":
      return {
        bg: "rgba(139, 92, 246, 0.15)",
        text: "#8B5CF6",
      };
    case "Uncommon":
      return {
        bg: "rgba(59, 130, 246, 0.15)",
        text: "#3B82F6",
      };
    default: // Common / default
      return {
        bg: "rgba(156, 163, 175, 0.15)",
        text: "#9CA3AF",
      };
  }
};

export default function RecentCards({
  item,
  onPress,
}: RecentCardsProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const styles = rarityStyles(item.rarity);

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[{ width: 165 }, animatedStyle]}
      onPressIn={() => {
        scale.value = withSpring(0.97);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <View
        className="rounded-3xl border border-[#232C3F] bg-[#0B1018] p-3"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 10,
          shadowOffset: {
            width: 0,
            height: 5,
          },
          elevation: 6,
        }}
      >
        {/* Image */}
        <View className="overflow-hidden rounded-2xl">
          <Image
            source={item.image}
            resizeMode="cover"
            style={{
              width: "100%",
              height: 180,
            }}
          />

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.65)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 60,
            }}
          />

          {item.isNew && (
            <LinearGradient
              colors={["#A855F7", "#7C3AED"]}
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: 9,
                }}
              >
                NEW
              </Text>
            </LinearGradient>
          )}

          {item.owned && (
            <View
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: "#22C55E",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Check
                size={14}
                color="white"
                strokeWidth={3}
              />
            </View>
          )}
        </View>

        {/* Content */}
        <View className="mt-3">
          <Text
            numberOfLines={1}
            className="text-base font-bold text-white"
            style={{
              fontSize: 16,
            }}
          >
            {item.title}
          </Text>

          <Text
            numberOfLines={1}
            className="mt-1 text-sm text-zinc-400"
            style={{
              fontSize: 13,
            }}
          >
            {item.subtitle}
          </Text>

          <View
            style={{
              marginTop: 10,
              alignSelf: "flex-start",
              borderRadius: 9999,
              paddingHorizontal: 12,
              paddingVertical: 5,
              backgroundColor: styles.bg,
            }}
          >
            <Text
              style={{
                fontWeight: "600",
                color: styles.text,
                fontSize: 11,
              }}
            >
              {item.rarity}
            </Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}