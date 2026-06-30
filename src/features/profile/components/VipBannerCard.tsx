import { LinearGradient } from 'expo-linear-gradient'
import { Crown } from 'lucide-react-native'
import { MotiView } from 'moti'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function VipBannerCard() {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: 200 }}
      className="mx-4 mt-4 rounded-2xl overflow-hidden border border-primary/20"
    >
      <LinearGradient
        colors={[
          '#4c1d95',
          '#1a0b36',
          '#0f051d',
        ]}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.3 }}
        style={StyleSheet.absoluteFill}
      />

      <View className="flex-row items-center justify-between gap-3 p-4 w-full">
        {/* Left Side Icon Container */}
        <View className="w-12 items-center justify-center shrink-0">
          <View className="bg-primary/20 border border-primary/30 p-3 rounded-xl shadow-md shadow-primary/40">
            <Crown size={24} color="#a855f7" fill="#6d28d9" />
          </View>
        </View>

        {/* Center Text block */}
        <View className="flex-1 gap-1.5 justify-center px-1">
          <View className="flex-row items-center gap-2 flex-wrap">
            <Text className="text-white font-bold text-base tracking-tight">
              HitBox VIP
            </Text>
            <View className="bg-primary px-1.5 py-0.5 rounded-md">
              <Text className="text-white text-[9px] font-black tracking-wider uppercase">
                NEW
              </Text>
            </View>
          </View>
          <Text className="text-muted-foreground text-[11px] leading-4 font-medium" numberOfLines={2}>
            Unlock premium rewards, early access, and exclusive experiences.
          </Text>
        </View>

        {/* Right Side Button Container */}
        <View className="min-w-[85px] items-end justify-center shrink-0">
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-primary px-3 py-2 rounded-xl shadow-sm shadow-primary/30 w-full items-center justify-center"
          >
            <Text className="text-white font-bold text-xs" numberOfLines={1}>
              Learn More
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </MotiView>
  )
}