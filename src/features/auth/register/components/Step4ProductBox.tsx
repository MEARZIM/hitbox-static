import { Box, Calendar, Check, CheckCircle2, Gift, Hash, ShieldCheck, ShoppingBag, Star, Ticket, User } from 'lucide-react-native'
import { MotiView } from 'moti'
import React from 'react'
import { ImageBackground, Text, View } from 'react-native'

export default function Step4ProductBox() {
    return (
        <View>
            <MotiView
                from={{ opacity: 0, translateY: 15 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 400, delay: 150 }}
                className="flex-row bg-neutral-950/40 border border-neutral-900 rounded-3xl p-4 mb-6 backdrop-blur-md"
            >
                {/* Left Box Image Graphic */}
                <View className="w-[42%] aspect-[9/16] bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden justify-end items-center relative">
                    <ImageBackground
                        source={{ uri: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop' }}
                        className="absolute inset-0 opacity-50 justify-end p-3"
                    />
                    <View className="absolute top-2 left-2 flex-row justify-between w-full pr-4">
                        <Text className="text-[7px] font-black text-white tracking-widest">HITBOX</Text>
                        <View className="w-2 h-2 bg-white/20 rounded-sm" />
                    </View>

                    <View className="items-center pb-4 z-10">
                        <Text className="text-white text-sm font-black italic tracking-tighter text-center leading-4">
                            PIERCE{'\n'}THE VEIL
                        </Text>
                        <Text className="text-primary text-[9px] font-bold tracking-widest mt-1">WARPED TOUR 2026</Text>
                    </View>

                    {/* Little Floating Checked Badge over artwork bottom right */}
                    <View className="absolute bottom-2 right-2 bg-primary p-1 rounded-full border border-background">
                        <Check size={10} color="#fff" strokeWidth={3} />
                    </View>
                </View>

                {/* Right Meta Specs Columns */}
                <View className="flex-1 pl-4 justify-between py-1">
                    <View className="flex-row items-center gap-x-1.5 bg-primary/10 border border-primary/20 self-start px-2 py-0.5 rounded-md">
                        <CheckCircle2 size={10} color="#a855f7" />
                        <Text className="text-primary text-[10px] font-bold uppercase tracking-wider">Verified</Text>
                    </View>

                    <View className="mt-1">
                        <Text className="text-white text-lg font-black tracking-tight">Pierce The Veil</Text>
                        <Text className="text-primary text-xs font-bold mt-0.5">Warped Tour 2026</Text>
                        <Text className="text-neutral-500 text-[10px] font-medium mt-0.5">Signature Series Card</Text>
                    </View>

                    {/* Matrix Spec List */}
                    <View className="gap-y-1.5 mt-3">
                        <View className="flex-row justify-between items-center">
                            <View className="flex-row items-center gap-x-1.5">
                                <Hash size={12} color="#737373" />
                                <Text className="text-neutral-400 text-xs">Card Number</Text>
                            </View>
                            <Text className="text-white text-xs font-semibold">#18 / 100</Text>
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
                                <Text className="text-neutral-400 text-xs">Status</Text>
                            </View>
                            <Text className="text-emerald-500 text-xs font-bold">Owned</Text>
                        </View>

                        <View className="flex-row justify-between items-center">
                            <View className="flex-row items-center gap-x-1.5">
                                <User size={12} color="#737373" />
                                <Text className="text-neutral-400 text-xs">Owner</Text>
                            </View>
                            <Text className="text-white text-xs font-semibold">You</Text>
                        </View>

                        <View className="flex-row justify-between items-center">
                            <View className="flex-row items-center gap-x-1.5">
                                <Calendar size={12} color="#737373" />
                                <Text className="text-neutral-400 text-xs">Claimed On</Text>
                            </View>
                            <Text className="text-white text-xs font-semibold">May 18, 2026</Text>
                        </View>
                    </View>
                </View>
            </MotiView>

            <Text className="text-neutral-400 text-xs font-semibold mb-3">What's Next?</Text>
            <Text className="text-neutral-500 text-[11px] -mt-2 mb-4">There's more to explore and unlock.</Text>


            <View className="flex-row justify-between mb-6">
                <View className="w-[23%] items-center">
                    <View className="p-2 bg-neutral-900/80 border border-neutral-800 rounded-xl mb-1.5">
                        <Box size={16} color="#a855f7" />
                    </View>
                    <Text className="text-white text-[10px] font-bold text-center leading-3">View Collection</Text>
                    <Text className="text-neutral-500 text-[8px] text-center mt-1 leading-3">See your full collection</Text>
                </View>

                <View className="w-[23%] items-center">
                    <View className="p-2 bg-neutral-900/80 border border-neutral-800 rounded-xl mb-1.5">
                        <Gift size={16} color="#a855f7" />
                    </View>
                    <Text className="text-white text-[10px] font-bold text-center leading-3">Unlock Rewards</Text>
                    <Text className="text-neutral-500 text-[8px] text-center mt-1 leading-3">Check for rewards you can redeem</Text>
                </View>

                <View className="w-[23%] items-center">
                    <View className="p-2 bg-neutral-900/80 border border-neutral-800 rounded-xl mb-1.5">
                        <Ticket size={16} color="#a855f7" />
                    </View>
                    <Text className="text-white text-[10px] font-bold text-center leading-3">Explore Experiences</Text>
                    <Text className="text-neutral-500 text-[8px] text-center mt-1 leading-3">Unlock exclusive content & perks</Text>
                </View>

                <View className="w-[23%] items-center">
                    <View className="p-2 bg-neutral-900/80 border border-neutral-800 rounded-xl mb-1.5">
                        <ShoppingBag size={16} color="#a855f7" />
                    </View>
                    <Text className="text-white text-[10px] font-bold text-center leading-3">Browse Marketplace</Text>
                    <Text className="text-neutral-500 text-[8px] text-center mt-1 leading-3">Buy, sell, or trade with other fans</Text>
                </View>
            </View>
        </View>
    )
}