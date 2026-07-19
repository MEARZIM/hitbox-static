import { Calendar, Hash, ShieldCheck, Star, Tag } from 'lucide-react-native'
import { MotiView } from 'moti'
import React from 'react'
import { ImageBackground, Text, View } from 'react-native'

export default function Step3ProductCard() {
    return (
        <MotiView
            from={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 400, delay: 150 }}
            className="flex-row bg-neutral-950/40 border border-neutral-900 rounded-3xl p-4 mb-6 backdrop-blur-md"
        >
            {/* Left side: Product Image Box */}
            <View className="w-[42%] aspect-[9/16] bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden justify-end items-center relative">
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop' }}
                    className="absolute inset-0 opacity-50 justify-end p-3"
                />
                <View className="absolute top-2 left-2 flex-row justify-between w-full pr-4">
                    <Text className="text-[7px] font-black text-white tracking-widest">HITBOX</Text>
                    <View className="w-2 h-2 bg-white/20 rounded-sm" />
                </View>

                <View className="items-center pb-4 z-15">
                    <Text className="text-white text-sm font-black italic tracking-tighter text-center leading-4">
                        PIERCE{'\n'}THE VEIL
                    </Text>
                    <Text className="text-primary text-[9px] font-bold tracking-widest mt-1">WARPED TOUR 2026</Text>
                </View>

                <View className="absolute bottom-1.5 items-center">
                    <Text className="text-neutral-500 text-[6px] font-bold uppercase tracking-widest">Card #18 | Limited Edition</Text>
                </View>
            </View>

            {/* Right side: Detailed Metadata Parameters */}
            <View className="flex-1 pl-4 justify-between py-1">
                {/* <View className="flex-row items-center gap-x-1.5 bg-primary/15 border border-primary/20 self-start px-2 py-0.5 rounded-md">
                    <CheckCircle2 size={15} color="#a855f7" />
                    <Text className="text-primary text-[15px] font-bold uppercase tracking-wider">Verified</Text>
                </View> */}

                <View className="mt-1">
                    <Text className="text-white text-lg font-black tracking-tight leading-5">Pierce The Veil</Text>
                    <Text className="text-primary text-xs font-bold mt-0.5">Warped Tour 2026</Text>
                    <Text className="text-neutral-500 text-[15px] font-medium mt-0.5">Signature Series Card</Text>
                </View>

                {/* Specs Table List */}
                <View className="gap-y-2 mt-3">
                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center gap-x-1.5">
                            <Tag size={12} color="#737373" />
                            <Text className="text-neutral-400 text-xs">Item Type</Text>
                        </View>
                        <Text className="text-white text-xs font-semibold">Trading Card</Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center gap-x-1.5">
                            <Hash size={12} color="#737373" />
                            <Text className="text-neutral-400 text-xs">Card Number</Text>
                        </View>
                        <Text className="text-white text-xs font-semibold">#18 / 150</Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center gap-x-1.5">
                            <Star size={12} color="#737373" />
                            <Text className="text-neutral-400 text-xs">Rarity</Text>
                        </View>
                        <Text className="text-primary text-xs font-bold">Rare</Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center gap-x-1.5">
                            <ShieldCheck size={12} color="#737373" />
                            <Text className="text-neutral-400 text-xs">Verification</Text>
                        </View>
                        <Text className="text-emerald-500 text-xs font-bold">Authentic</Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center gap-x-1.5">
                            <Calendar size={12} color="#737373" />
                            <Text className="text-neutral-400 text-xs">Released</Text>
                        </View>
                        <Text className="text-white text-xs font-semibold">June 1, 2026</Text>
                    </View>
                </View>
            </View>
        </MotiView>
    )
}