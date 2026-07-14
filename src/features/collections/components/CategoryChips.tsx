import { LinearGradient } from "expo-linear-gradient";
import { LucideIcon } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  title: string;
  Icon?: LucideIcon;
  active?: boolean;
  onPress?: () => void;
}

const CategoryChips: React.FC<Props> = ({
  title,
  Icon,
  active = false,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress}>
      {active ? (
        <LinearGradient
          colors={["#7C3AED", "#5B21B6"]}
          style={{
            height: 38,
            borderRadius: 19,
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#7C3AED",
            shadowOpacity: 0.25,
            shadowRadius: 8,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            elevation: 4,
          }}
        >
          {Icon && (
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 8,
              }}
            >
              <Icon size={12} color="#FFFFFF" strokeWidth={2.5} />
            </View>
          )}

          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            {title}
          </Text>
        </LinearGradient>
      ) : (
        <View
          style={{
            height: 38,
            borderRadius: 19,
            paddingHorizontal: 20,
            backgroundColor: "#0B0F19",
            borderWidth: 1,
            borderColor: "#1E293B",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {Icon && (
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: "#161D2F",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 8,
              }}
            >
              <Icon size={12} color="#94A3B8" strokeWidth={2.3} />
            </View>
          )}

          <Text
            style={{
              color: "#94A3B8",
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export default CategoryChips;