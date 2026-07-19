import { MotiView } from 'moti'
import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, ImageBackground, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { Badge } from '@/components/ui/badge'
import { DiscoverProductItem } from '../types/discover'
import { DISCOVER_PLACEHOLDER_IMAGE, formatRewardPoints } from '../utils/format'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CAROUSEL_WIDTH = SCREEN_WIDTH - 32

interface HeroSlide {
    id: string | number
    title: string
    subtitle: string
    uri: string
}

// Static fallback shown while the discover feed loads (or if it's empty)
const SLIDER_DATA = [
    {
        id: 1,
        title: "Warped Tour 2026",
        subtitle: "Relive the moments. Own the legacy.",
        uri: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200",
    },
    {
        id: 2,
        title: "Retro Collection",
        subtitle: "Vintage aesthetics, timeless pieces.",
        uri: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200",
    },
    {
        id: 3,
        title: "Summer Drop",
        subtitle: "Fresh gear built for the heat.",
        uri: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200",
    },
    {
        id: 4,
        title: "Festival Essentials",
        subtitle: "Everything you need to stand out.",
        uri: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200",
    },
    {
        id: 5,
        title: "Limited Edition Plates",
        subtitle: "Rare vault collectables drop Friday.",
        uri: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200",
    },
]

interface HeroBannerProps {
    /** Featured products from GET /api/v1/discover (≤5). Falls back to static slides when absent. */
    items?: DiscoverProductItem[]
    onItemPress?: (item: DiscoverProductItem) => void
}

export default function HeroBanner({ items, onItemPress }: HeroBannerProps) {
    const [activeIndex, setActiveIndex] = useState(0)
    const scrollViewRef = useRef<ScrollView>(null)

    const featured = items ?? []
    const slides: HeroSlide[] = featured.length > 0
        ? featured.map((item) => ({
            id: item.id,
            title: item.name,
            subtitle: `Earn ${formatRewardPoints(item.rewardPoints)} with this drop.`,
            uri: item.imageUrl ?? DISCOVER_PLACEHOLDER_IMAGE,
        }))
        : SLIDER_DATA

    useEffect(() => {
        if (slides.length < 2) return
        const timer = setInterval(() => {
            const nextIndex = (activeIndex + 1) % slides.length
            setActiveIndex(nextIndex)

            scrollViewRef.current?.scrollTo({
                x: nextIndex * CAROUSEL_WIDTH,
                animated: true,
            })
        }, 4000)

        return () => clearInterval(timer)
    }, [activeIndex, slides.length])


    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollOffset = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(scrollOffset / CAROUSEL_WIDTH);
        if (currentIndex !== activeIndex && currentIndex >= 0 && currentIndex < slides.length) {
            setActiveIndex(currentIndex);
        }
    };

    return (
        <View className="mt-5 h-52 mx-4 relative overflow-hidden rounded-xl">
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={CAROUSEL_WIDTH}
            >
                {slides.map((item, slideIndex) => (
                    <View key={item.id} style={{ width: CAROUSEL_WIDTH }} className="h-full">
                        <ImageBackground
                            source={{ uri: item.uri }}
                            resizeMode="cover"
                            imageStyle={{ borderRadius: 20 }}
                            className="w-full h-full"
                        >

                            <View className="flex-1 bg-black/40 p-5 justify-between">

                                <Badge variant="default" className="self-start bg-primary active:bg-primary">
                                    <Text className="text-[10px] font-semibold tracking-wider text-white">
                                        FEATURED
                                    </Text>
                                </Badge>

                                
                                <View className="mb-4">
                                    <Text className="text-2xl font-bold text-white">
                                        {item.title}
                                    </Text>

                                    <Text className="mt-2 text-sm text-gray-200">
                                        {item.subtitle}
                                    </Text>

                                    <View className="min-w-[85px] max-w-[40%] mt-6 items-end justify-center shrink-0">
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                const product = featured[slideIndex]
                                                if (product) onItemPress?.(product)
                                            }}
                                            className="bg-primary px-3 py-2 rounded-xl shadow-sm shadow-primary/30 w-full items-center justify-center"
                                        >
                                            <Text className="text-white font-bold text-xs" numberOfLines={1}>
                                                Explore Collection
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                ))}
            </ScrollView>

            <View className="absolute bottom-5 left-0 right-0 flex-row justify-center pointer-events-none">
                {slides.map((_, index) => {
                    const isActive = index === activeIndex
                    return (
                        <MotiView
                            key={index}
                            animate={{
                                width: isActive ? 24 : 8,
                                backgroundColor: isActive ? "#A855F7" : "rgba(156, 163, 175, 1)", // primary violet color vs gray-500
                            }}
                            transition={{
                                type: "spring",
                                damping: 15,
                                stiffness: 180,
                            }}
                            className="mx-1 h-2 rounded-full"
                        />
                    )
                })}
            </View>
        </View>
    )
}