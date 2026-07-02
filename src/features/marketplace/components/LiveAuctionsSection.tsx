import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

interface LiveauctionProps {
    LIVE_AUCTIONS: {
        id: string;
        title: string;
        subtitle: string;
        price: string;
        bids: string;
        timeLeft: string; 
        image: string;
    }[]
}

export default function LiveAuctionSection({ LIVE_AUCTIONS }: LiveauctionProps) {
    return (
        <View className="px-4">
            {/* Section Header */}
            <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white text-lg font-bold tracking-tight">Live Auctions</Text>
                <Pressable className="flex-row items-center active:opacity-75">
                    <Text className="text-purple-500 text-xs font-semibold mr-1">See All</Text>
                    <ChevronRight color="#a855f7" size={16} />
                </Pressable>
            </View>

            {/* Main Outer Container Wrapper */}
            <View className="bg-[#0b0d19]/60 border border-zinc-800 rounded-2xl px-4 py-1">
                {LIVE_AUCTIONS.map((auction, index) => {
                    // Split time components if format allows, or assume standard breakdown
                    const timeParts = auction.timeLeft.split('\n');

                    return (
                        <View
                            key={auction.id}
                            className={`flex-row items-center py-4 ${index !== LIVE_AUCTIONS.length - 1 ? 'border-b border-zinc-800/60' : ''
                                }`}
                        >
                            {/* Auction Image */}
                            <Image
                                source={{ uri: auction.image }}
                                className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800"
                                resizeMode="cover"
                            />

                            {/* Separated Time Box */}
                            <View className="border border-purple-900/60 rounded-xl px-2.5 py-1.5 ml-3 items-center justify-center min-w-[52px]">
                                {timeParts.map((part, pIdx) => (
                                    <Text
                                        key={pIdx}
                                        className={`text-center text-[11px] font-bold ${part.toLowerCase() === 'left' ? 'text-zinc-500 font-normal text-[10px] mt-0.5' : 'text-purple-400'
                                            }`}
                                    >
                                        {part}
                                    </Text>
                                ))}
                            </View>

                            {/* Core Metadata Info */}
                            <View className="flex-1 pl-3 justify-center">
                                <Text className="text-white text-sm font-semibold tracking-tight" numberOfLines={1}>
                                    {auction.title}
                                </Text>
                                <Text className="text-zinc-400 text-[11px] mt-0.5" numberOfLines={1}>
                                    {auction.subtitle}
                                </Text>

                                {/* Price Layout */}
                                <View className="flex-row items-center mt-2">
                                    <Text className="text-zinc-400 text-xs mr-1">Current Bid</Text>
                                    {/* Purple Gem Icon */}
                                    <View className="w-4 h-4 rounded bg-purple-600 justify-center items-center mr-1 rotate-45 scale-75">
                                        <Text className="text-[9px] text-white font-black -rotate-45">♦</Text>
                                    </View>
                                    <Text className="text-white text-sm font-bold tracking-tight">
                                        {auction.price}
                                    </Text>
                                </View>
                            </View>

                            {/* Bids Count (Positioned to the right side) */}
                            <Text className="text-zinc-400 text-xs mr-3">
                                {auction.bids}
                            </Text>

                            {/* Border-only Action Button */}
                            <Pressable className="border border-purple-900 px-4 py-2 rounded-xl active:opacity-70 bg-transparent">
                                <Text className="text-purple-400 text-xs font-bold">Place Bid</Text>
                            </Pressable>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}