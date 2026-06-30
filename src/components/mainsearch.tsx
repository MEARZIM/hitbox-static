import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Search, Mic } from "lucide-react-native";
import { BlurView } from "expo-blur";

interface MainSearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onVoicePress?: () => void;
}

export default function MainSearchBar({
  placeholder = "Search artists, collections...",
  value,
  onChangeText,
  onVoicePress,
}: MainSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <BlurView
      intensity={30}
      tint="dark"
      className="mt-6 overflow-hidden rounded-2xl"
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
  );
}