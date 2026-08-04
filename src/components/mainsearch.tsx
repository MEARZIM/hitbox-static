import { cn } from "@/lib/utils";
import { BlurView } from "expo-blur";
import { Mic, Search, X } from "lucide-react-native";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface MainSearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onVoicePress?: () => void;
  onClear?: () => void;
  classname?: string
}

export default function MainSearchBar({
  placeholder = "Search artists, collections...",
  value,
  onChangeText,
  onVoicePress,
  onClear,
  classname
}: MainSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Only worth showing while there is something to clear.
  const hasText = !!value?.length;

  const handleClear = () => {
    onChangeText?.("");
    onClear?.();
  };

  return (
    <View className={cn('mx-4 my-3', classname)}>
      <BlurView
        intensity={30}
        tint="dark"
        className={cn("mt-6 overflow-hidden rounded-2xl")}
      >
        <View
          className="h-10 flex-row items-center rounded-3xl px-4"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            borderWidth: 1,
            borderColor: isFocused
              ? "#A855F7" // Primary color
              : "rgba(255,255,255,0.08)",
          }}
        >
          <Search size={20} color="#8B5CF6" />

          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#71717A"
            className="ml-3 flex-1 text-[15px] text-white"
            cursorColor="#A855F7"
            selectionColor="#A855F7"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {/* Clear — rendered only while the field has text */}
          {hasText && (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              activeOpacity={0.7}
              hitSlop={10}
              onPress={handleClear}
              className="ml-2 h-5 w-5 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
            >
              <X size={12} color="#D4D4D8" strokeWidth={3} />
            </TouchableOpacity>
          )}

          <View
            className="mx-3 h-6 w-[1px]"
            style={{
              backgroundColor: isFocused ? "#A855F7" : "#3F3F46",
            }}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onVoicePress}
            className="mr-2"
          >
            <Mic
              size={18}
              color={isFocused ? "#A855F7" : "#71717A"}
            />
          </TouchableOpacity>
        </View>
      </BlurView>
    </View >
  );
}