import { ChevronRight, Heart } from 'lucide-react-native'
import { MotiView } from 'moti'
import React from 'react'
import { Dimensions, Image, Pressable, ScrollView, Text, View } from 'react-native'

interface ListingProps {
    FEATURED_LISTINGS: {
        id: string;
        tag: string;
        title: string;
        subtitle: string;
        price: string;
        bids: string;
        time: string;
        image: string;
    }[]
}

export default function ListingsSection(FEATURED_LISTINGS: ListingProps) {
    const { width } = Dimensions.get('window');
    const CARD_WIDTH = width * 0.43;

    return (
        <View className="mb-6">
            <View className="px-4 flex-row justify-between items-center mb-3">
                <Text className="text-foreground text-base font-bold tracking-tight">Featured Listings</Text>
                <Pressable className="flex-row items-center">
                    <Text className="text-primary text-xs font-semibold mr-0.5">See All</Text>
                    <ChevronRight color="#6d28d9" size={14} />
                </Pressable>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="pl-4"
                contentContainerStyle={{ paddingRight: 24 }}
            >
                {FEATURED_LISTINGS.FEATURED_LISTINGS.map((item, index) => (
                    <MotiView
                        key={item.id}
                        from={{ opacity: 0, translateX: 20 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ type: 'timing', delay: index * 100 }}
                        style={{ width: CARD_WIDTH }}
                        className="mr-3 bg-card border border-primary rounded-2xl overflow-hidden p-2.5"
                    >
                        <View className="relative w-full aspect-square rounded-xl overflow-hidden bg-muted">
                            <Image source={{ uri: item.image }} className="w-full h-full" />
                            <View className="absolute top-2 left-2 bg-primary-80 px-1.5 py-0.5 rounded-lg">
                                <Text className="text-white text-[9px] font-black tracking-wide">{item.tag}</Text>
                            </View>
                            <Pressable className="absolute top-2 right-2 w-7 h-7 bg-black/40 rounded-full justify-center items-center">
                                <Heart color="white" size={13} />
                            </Pressable>
                        </View>

                        <View className="mt-2.5 px-0.5">
                            <Text className="text-foreground text-xs font-bold" numberOfLines={1}>{item.title}</Text>
                            <Text className="text-muted-foreground text-[11px] mt-0.5" numberOfLines={1}>{item.subtitle}</Text>

                            <View className="flex-row items-center mt-2.5">
                                <View className="w-3.5 h-3.5 rounded-full bg-primary justify-center items-center mr-1">
                                    <Text className="text-[8px] text-primary-foreground font-black">♦</Text>
                                </View>
                                <Text className="text-foreground text-xs font-extrabold">{item.price}</Text>
                            </View>

                            <View className="flex-row justify-between items-center mt-1.5 pt-1.5 border-t border-border">
                                <Text className="text-muted-foreground text-[10px]">{item.bids}</Text>
                                <Text className="text-secondary-foreground text-[10px] font-medium">{item.time}</Text>
                            </View>
                        </View>
                    </MotiView>
                ))}
            </ScrollView>
        </View>
    )
}
