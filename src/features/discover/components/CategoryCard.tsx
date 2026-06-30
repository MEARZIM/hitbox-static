import { BlurView } from "expo-blur";
import { LucideIcon } from "lucide-react-native";
import { MotiView } from "moti";
import React from "react";
import { Pressable, Text, View } from "react-native";

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
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <MotiView
          animate={{
            scale: pressed ? 0.95 : 1,
          }}
          transition={{
            type: "spring",
            damping: 12,
            stiffness: 220,
          }}
          className="mr-3 overflow-hidden rounded-2xl"
        >
          <BlurView
            intensity={30}
            tint="dark"
            className="overflow-hidden rounded-2xl"
          >
            <View
              className={`h-12 flex-row items-center rounded-2xl px-3 ${active ? "border border-primary-80" : "border border-white/10"
                }`}
              style={{

                backgroundColor: active
                  ? "rgba(168,85,247,0.12)"
                  : "rgba(255,255,255,0.04)",

              }}
            >
              {/* Icon */}
              <View
                className={`mr-2 rounded-xl p-2 ${active ? "bg-primary-80" : "bg-white/5"

                  }`}
              >
                <Icon
                  size={15}
                  color="#ffffff"
                // fill={active ? "#A855F7" : "none"}
                />
              </View>

              {/* Text */}
              <Text className="text-[11px] font-semibold text-white">
                {title}
              </Text>
            </View>
          </BlurView>
        </MotiView>
      )}
    </Pressable>
  );
};

export default CategoryCard;