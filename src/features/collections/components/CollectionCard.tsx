import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable =
  Animated.createAnimatedComponent(Pressable);

interface CollectionItem {
  id: string;
  title: string;
  subtitle: string;
  image: { uri: string };
  owned: number;
  total: number;
  featured: boolean;
}

interface Props {
  item: CollectionItem;
}

export default function CollectionCard({ item }: Props) {
  const { width } = useWindowDimensions();
  const CARD_WIDTH = (width - 56) / 3;

  const progress = Math.round(
    (item.owned / item.total) * 100
  );

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[
        {
          width: CARD_WIDTH,
        },
        animatedStyle,
      ]}
      onPressIn={() =>
        (scale.value = withSpring(0.97))
      }
      onPressOut={() =>
        (scale.value = withSpring(1))
      }
      onPress={() => {
        router.push({
          pathname: "/collections/view-collection",
          params: { id: item.id },
        });
      }}
    >
      <View
        className="rounded-3xl border border-[#232C3F] bg-[#0B1018] p-2.5"
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
        {/* IMAGE */}
        <View
          className="overflow-hidden rounded-2xl"
          style={{
            height: CARD_WIDTH * 0.82,
          }}
        >
          <Image
            source={item.image}
            resizeMode="cover"
            style={{
              width: "100%",
              height: "100%",
            }}
          />

          <LinearGradient
            colors={[
              "transparent",
              "rgba(0,0,0,0.65)",
            ]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 35,
            }}
          />

          {item.featured && (
            <LinearGradient
              colors={["#A855F7", "#7C3AED"]}
              style={{
                position: "absolute",
                top: 6,
                left: 6,
                borderRadius: 8,
                paddingHorizontal: 6,
                paddingVertical: 3,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: 7,
                }}
              >
                FEATURED
              </Text>
            </LinearGradient>
          )}
        </View>

        {/* CONTENT */}
        <View className="mt-3">
          <Text
            numberOfLines={2}
            className="font-bold text-white"
            style={{
              fontSize: 10,
              lineHeight: 13,
            }}
          >
            {item.title}
          </Text>

          <Text
            numberOfLines={1}
            className="mt-1 text-zinc-400"
            style={{
              fontSize: 8,
            }}
          >
            {item.subtitle}
          </Text>
        </View>

        {/* PROGRESS */}
        <View
          style={{
            marginTop: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 8,
                fontWeight: "700",
              }}
            >
              {item.owned}/{item.total}
            </Text>

            <Text
              style={{
                color: "#8B95A7",
                fontSize: 8,
              }}
            >
              {progress}%
            </Text>
          </View>

          <View
            style={{
              height: 3,
              backgroundColor: "#1A2234",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <LinearGradient
              colors={["#A855F7", "#7C3AED"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: 10,
              }}
            />
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}