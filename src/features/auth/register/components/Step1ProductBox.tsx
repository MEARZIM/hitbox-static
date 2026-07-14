import { ChevronRight, ShieldCheck } from 'lucide-react-native'
import { MotiView } from 'moti'
import React from 'react'
import { ImageBackground, Text, View } from 'react-native'

export default function Step1ProductBox() {
  return (
    <View>
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 600, delay: 100 }}
        className="flex-row justify-center items-center gap-x-4 my-4"
      >

        <View className="w-40 h-48 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl relative justify-center items-center">
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop' }}
            className="absolute inset-0 opacity-40 justify-end p-3"
          />
          <View className="absolute top-3 left-3">
            <Text className="text-[10px] font-black text-foreground tracking-widest">HITBOX</Text>
          </View>
          <Text className="text-foreground text-xl font-black italic tracking-tighter text-center px-2">
            WARPED{'\n'}TOUR
          </Text>
          <Text className="text-foreground text-base font-black tracking-widest mt-1">2026</Text>
        </View>

        {/* Pass/Card Badge Layout */}
        <View className="w-36 h-44 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl relative p-3 justify-between">
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop' }}
            className="absolute inset-0 opacity-30"
          />
          <View className="flex-row justify-between items-center z-10">
            <Text className="text-[8px] font-black text-foreground tracking-widest">HITBOX</Text>
            {/* <View className="w-3 h-3 bg-white/20 rounded-sm" /> */}
          </View>

          <View className="items-center z-10 my-1">
            <Text className="text-foreground text-xs font-black italic tracking-tighter">WARPED TOUR</Text>
            <Text className="text-foreground text-[10px] font-bold">2026</Text>
          </View>
        </View>

      </MotiView>

      <View className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 flex-row items-center justify-between mb-6 mt-4">
        <View className="flex-row items-center flex-1 gap-x-3">
          <View className="p-2.5 bg-primary rounded-xl">
            <ShieldCheck size={22} color="#fff" />
          </View>
          <View className="flex-1 pr-2">
            <Text className="text-white font-bold text-sm">100% Authentic</Text>
            <Text className="text-neutral-400 text-xs mt-0.5 leading-4">
              Every HitBox product is verified for authenticity and ownership.
            </Text>
          </View>
        </View>
        <ChevronRight size={18} color="#737373" />
      </View>
    </View>
  )
}