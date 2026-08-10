import { router } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import React from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import SupportContactCard from '../components/SupportContactCard'
import SupportHeader from '../components/SupportHeader'
import { SUPPORT_CHANNELS, SUPPORT_PLACEHOLDER_NOTICE } from '../data/support'

/**
 * Support / Contact Us — email plus the two regional phone lines.
 *
 * Structured like `LegalDocument`: same header bar, same card treatment, same
 * back-handling, so a user arriving from the header button sees a screen that
 * belongs to the app rather than a bolt-on.
 */
export default function SupportScreen() {
    const { width } = useWindowDimensions()
    // Matches the breakpoint MainHeader already uses for its tablet sizing.
    const isTablet = width >= 768

    const goBack = () => {
        // Deep links can land here with nothing behind them.
        if (router.canGoBack()) router.back()
        else router.replace('/discover')
    }

    return (
        <View className="flex-1 bg-background">
            <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
                {/* Header bar */}
                <View className="flex-row items-center gap-3 px-5 py-4 border-b border-white/10">
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                        onPress={goBack}
                        hitSlop={8}
                        className="w-10 h-10 rounded-full bg-white/10 items-center justify-center active:opacity-60"
                    >
                        <ChevronLeft size={22} color="#fff" />
                    </TouchableOpacity>

                    <Image
                        source={require('@/assets/images/HitBoxLogo.png')}
                        resizeMode="contain"
                        style={{ width: 32, height: 32 }}
                    />

                    <Text className="text-white text-lg font-bold flex-1" numberOfLines={1}>
                        Support
                    </Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: isTablet ? 32 : 24,
                        paddingBottom: 48,
                    }}
                >
                    <SupportHeader />

                    {/* The phone lines are dummies — say so before the cards. */}
                    <View className="mt-4 rounded-xl border border-primary/40 bg-primary-10 px-4 py-3">
                        <Text className="text-neutral-200 text-xs leading-5 font-medium">
                            {SUPPORT_PLACEHOLDER_NOTICE}
                        </Text>
                    </View>

                    {/* Stacked on phones; one row of three once there's width for it. */}
                    <View className={isTablet ? 'mt-6 flex-row gap-4' : 'mt-6 gap-4'}>
                        {SUPPORT_CHANNELS.map((channel, index) => (
                            <SupportContactCard
                                key={channel.id}
                                channel={channel}
                                delay={index * 80}
                                className={isTablet ? 'flex-1' : undefined}
                            />
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}
