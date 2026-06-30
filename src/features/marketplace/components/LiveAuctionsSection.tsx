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
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-foreground text-base font-bold tracking-tight">Live Auctions</Text>
                <Pressable className="flex-row items-center active:opacity-75">
                    <Text className="text-primary text-xs font-semibold mr-0.5">See All</Text>
                    <ChevronRight color="#6d28d9" size={14} />
                </Pressable>
            </View>

            {/* Auction List Container */}
            <View className="gap-3">
                {LIVE_AUCTIONS.map((auction) => (
                    <View
                        key={auction.id}
                        className="bg-card border border-primary rounded-2xl p-3 flex-row items-center"
                    >
                        {/* Image Container with Absolute Time Badge */}
                        <View className="relative w-20 h-20 mr-3">
                            <Image
                                source={{ uri: auction.image }}
                                className="w-full h-full rounded-xl bg-muted"
                            />
                            {/* Premium Time overlay badge utilizing background layout */}
                            <View className="absolute bottom-1 left-1 right-1 bg-colors-background-80 border border-primary-40 rounded-md py-0.5 items-center justify-center">
                                <Text className="text-primary text-[9px] font-extrabold tracking-wide text-center uppercase">
                                    {auction.timeLeft.replace(/\n/g, ' ')}
                                </Text>
                            </View>
                        </View>

                        {/* Core Metadata Info */}
                        <View className="flex-1 justify-center pr-2">
                            <Text className="text-foreground text-sm font-bold tracking-tight" numberOfLines={1}>
                                {auction.title}
                            </Text>
                            <Text className="text-muted-foreground text-[11px] mt-0.5" numberOfLines={1}>
                                {auction.subtitle}
                            </Text>

                            {/* Price & Bid Sub-row */}
                            <View className="flex-row items-center mt-2">
                                <View className="w-3.5 h-3.5 rounded-full bg-primary justify-center items-center mr-1">
                                    <Text className="text-[8px] text-primary-foreground font-black">♦</Text>
                                </View>
                                <Text className="text-foreground text-xs font-black tracking-tight mr-2">
                                    {auction.price}
                                </Text>
                                <Text className="text-muted-foreground text-[10px] bg-secondary px-1.5 py-0.5 rounded border border-colors-primary-40">
                                    {auction.bids}
                                </Text>
                            </View>
                        </View>

                        {/* Premium Interactive Action Button using safe custom configurations */}
                        <Pressable className="bg-primary-10 border border-primary-40 px-3.5 py-2 rounded-xl active:opacity-80">
                            <Text className="text-primary text-xs font-bold tracking-tight">Place Bid</Text>
                        </Pressable>
                    </View>
                ))}
            </View>
        </View>
    );
}