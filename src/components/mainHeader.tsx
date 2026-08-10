import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Bell, HandHelping, Settings, UserPlus } from "lucide-react-native";
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
  /** Overrides the live unread count from `useNotifications()`. */
  notificationCount?: number;
  /** Overrides the default push to `/notifications`. */
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
  /** Overrides the default push to `/support`. */
  onSupportPress?: () => void;
  /** Overrides the default push to `/(auth)/register` on the signed-out button. */
  onSignUpPress?: () => void;
  className?: string;
  /** 'compact' shows the title inline with the icons (no logo row), subtitle below. */
  variant?: "default" | "compact";
}

const MainHeader: React.FC<MainHeaderProps> = ({
  title,
  subtitle,
  notificationCount,
  onNotificationPress,
  onSettingsPress,
  onSupportPress,
  onSignUpPress,
  className,
  variant = "default",
}) => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { unreadCount } = useNotifications();

  // Callers may pin a count; otherwise the badge follows the real feed.
  const badgeCount = notificationCount ?? unreadCount;

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      router.push("/notifications");
    }
  };

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      router.push("/settings");
    }
  };

  const handleSupportPress = () => {
    if (onSupportPress) {
      onSupportPress();
    } else {
      router.push("/support");
    }
  };

  const handleSignUpPress = () => {
    if (onSignUpPress) {
      onSignUpPress();
    } else {
      router.push("/(auth)/register");
    }
  };

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
        {variant === "compact" ? (
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontSize: isTablet ? 38 : isSmall ? 26 : 32,
              fontWeight: "900",
              color: "white",
              letterSpacing: -1,
              marginRight: 12,
            }}
          >
            {title}
          </Text>
        ) : (
          <Image
            source={require("@/assets/images/HitBoxLogo.png")}
            resizeMode="contain"
            style={{
              width: logoWidth,
              height: logoHeight,
              marginLeft: -60,
            }}
          />
        )}

        <View className="flex-row items-center">

          {/* Support — first in the cluster so Settings / Sign Up keeps the
              far-right slot users already reach for. Available signed out too:
              someone who can't get into their account is exactly who needs it. */}
          <TouchableOpacity
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Support and contact us"
            onPress={handleSupportPress}
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
            <HandHelping size={iconSize} color="white" strokeWidth={2} />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={
              badgeCount > 0 ? `Notifications, ${badgeCount} unread` : "Notifications"
            }
            onPress={handleNotificationPress}
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
            <Bell
              size={iconSize}
              color="white"
              strokeWidth={2}
            />

            {badgeCount > 0 && (
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
                  {badgeCount > 99
                    ? "99+"
                    : badgeCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Settings when signed in, Sign Up when not — same slot either way */}
          {isSignedIn ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSettingsPress}
              style={{
                width: buttonSize,
                height: buttonSize,
                borderRadius: buttonSize / 2,
                backgroundColor: "#18181B",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Settings
                size={iconSize}
                color="white"
                strokeWidth={2}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              accessibilityRole="button"
              onPress={handleSignUpPress}
              style={{
                height: buttonSize,
                borderRadius: buttonSize / 2,
                backgroundColor: "#7C3AED",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                paddingHorizontal: isTablet ? 20 : 16,
              }}
            >
              <UserPlus
                size={iconSize - 3}
                color="white"
                strokeWidth={2.5}
              />
              <Text
                style={{
                  color: "white",
                  fontWeight: "700",
                  fontSize: isTablet ? 15 : 13,
                  marginLeft: 6,
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Header Content */}
      <View
        style={{
          marginTop: variant === "compact" ? 6 : isTablet ? 30 : 22,
        }}
      >
        {variant !== "compact" && (
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
        )}

        {subtitle && (
          <Text
            style={{
              marginTop: variant === "compact" ? 0 : 8,
              fontSize: isTablet ? 17 : variant === "compact" ? 13 : 15,
              color: "#A1A1AA",
              lineHeight: variant === "compact" ? 18 : 24,
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