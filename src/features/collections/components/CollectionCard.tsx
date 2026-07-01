import { LinearGradient } from "expo-linear-gradient";
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
    >
      <View
        style={{
          backgroundColor: "#0A0F1C",
          borderRadius: 1,
          borderWidth: 1,
          borderColor: "#24324A",
          padding: 5,
          overflow: "hidden",
        }}
      >
        {/* IMAGE */}
        <View
          style={{
            height: CARD_WIDTH * 0.82,
            borderRadius: 1,
            overflow: "hidden",
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
              "rgba(0,0,0,0.55)",
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
              colors={["#8B5CF6", "#6D28D9"]}
              style={{
                position: "absolute",
                top: 6,
                left: 6,
                borderRadius: 20,
                paddingHorizontal: 6,
                paddingVertical: 2,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: 6,
                }}
              >
                FEATURED
              </Text>
            </LinearGradient>
          )}
        </View>

        {/* CONTENT */}
        <View style={{ marginTop: 6 }}>
          <Text
            numberOfLines={2}
            style={{
              color: "#fff",
              fontSize: 10,
              fontWeight: "700",
              lineHeight: 13,
            }}
          >
            {item.title}
          </Text>

          <Text
            numberOfLines={1}
            style={{
              color: "#8B5CF6",
              fontSize: 8,
              marginTop: 4,
            
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