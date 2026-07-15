import { cn } from "@/lib/utils";
import { Bell, Settings } from "lucide-react-native";
import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

interface MainHeaderProps {
  title: string;
  subtitle?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
  className?: string;
}

const MainHeader: React.FC<MainHeaderProps> = ({
  title,
  subtitle,
  notificationCount = 0,
  onNotificationPress,
  onSettingsPress,
  className,
}) => {
  const { width } = useWindowDimensions();

  const isSmall = width < 375;
  const isTablet = width >= 768;

  const logoWidth = isTablet ? 220 : isSmall ? 155 : 180;
  const logoHeight = isTablet ? 70 : isSmall ? 50 : 58;

  const titleSize = isTablet ? 46 : isSmall ? 32 : 40;

  const iconSize = isTablet ? 24 : 21;
  const buttonSize = isTablet ? 52 : 44;

  return (
    <View
      className={cn("px-5 pt-4 pb-6", className)}
      style={{
        paddingHorizontal: isTablet ? 32 : 20,
      }}
    >
      {/* Top Row */}
      <View className="flex-row items-center justify-between">
        <Image
          source={require("@/assets/images/HitBoxLogo.png")}
          resizeMode="contain"
          style={{
            width: logoWidth,
            height: logoHeight,
            marginLeft: -60,
          }}
        />

        <View className="flex-row items-center">
          {/* Settings */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onSettingsPress}
            style={{
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
              backgroundColor: "#18181B",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Settings
              size={iconSize}
              color="white"
              strokeWidth={2}
            />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onNotificationPress}
            style={{
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
              backgroundColor: "#18181B",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Bell
              size={iconSize}
              color="white"
              strokeWidth={2}
            />

            {notificationCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -3,
                  right: -3,
                  minWidth: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "#7C3AED",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 4,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 10,
                    fontWeight: "700",
                  }}
                >
                  {notificationCount > 99
                    ? "99+"
                    : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Header Content */}
      <View
        style={{
          marginTop: isTablet ? 30 : 22,
        }}
      >
        <Text
          style={{
            fontSize: titleSize,
            fontWeight: "900",
            color: "white",
            letterSpacing: -1,
          }}
        >
          {title}
        </Text>

        {subtitle && (
          <Text
            style={{
              marginTop: 8,
              fontSize: isTablet ? 17 : 15,
              color: "#A1A1AA",
              lineHeight: 24,
              maxWidth: "92%",
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};

export default MainHeader;