import { router } from 'expo-router'
import { ChevronRight } from 'lucide-react-native'
import { MotiView } from 'moti'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

/**
 * Step 2 header — also carries the **Skip** escape hatch. `src/app/index.tsx`
 * sends every signed-out cold start here, so without it a guest has no way into
 * the public parts of the app (discover, marketplace, verifying a tag).
 */
export default function Step2Header({
    /** Overrides the default replace to `/(tabs)/discover`. */
    onSkip,
}: {
    onSkip?: () => void
}) {
    return (
        <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="items-center my-6"
        >
            {/* Replace, not push: registration shouldn't sit behind the tabs. */}
            <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Skip sign up and browse"
                activeOpacity={0.7}
                hitSlop={12}
                onPress={() => (router.push('/(tabs)/discover'))}
                className="absolute right-0 top-0 z-10 flex-row items-center px-2 py-1"
            >
                <Text className="text-neutral-400 text-sm font-semibold">Skip</Text>
                <ChevronRight size={16} color="#A3A3A3" />
            </TouchableOpacity>

            <View className="flex items-center justify-center w-full">

                <Image
                    source={require("@/assets/images/HitBoxLogo.png")}
                    resizeMode="contain"
                    style={{
                        width: 40,
                        height: 40,
                    }}
                />

            </View>
            <Text className="text-white text-2xl font-bold mt-4 tracking-tight">
                {`Let’s get you in`}
            </Text>
            <Text className="text-neutral-400 text-center text-sm mt-2 px-4 leading-5">
                Create your account to claim your item, track your collection, and unlock exclusive experiences.
            </Text>
        </MotiView>
    )
}
