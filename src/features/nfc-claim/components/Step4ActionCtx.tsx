import { router } from 'expo-router'
import { LayoutDashboard, Radio } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'

import { AnimatedButton } from '../../auth/register/components/AnimatedButton'

export default function Step4ActionCtx() {
    return (
        <View className="gap-y-3 w-full items-center">
            <AnimatedButton
                className="bg-primary h-14 rounded-2xl flex-row items-center justify-center gap-x-2.5 shadow-lg shadow-primary w-full"
                onPress={() => router.push('/(tabs)/collections')}
            >
                <LayoutDashboard size={25} color="#ffffff" />
                <Text className="text-white font-bold text-[15px]">Go to My Collection</Text>
            </AnimatedButton>

            <AnimatedButton
                className="w-full border border-neutral-800 h-14 rounded-2xl flex-row items-center justify-center gap-x-2.5 bg-neutral-900/40"
                onPress={() => router.push('/(auth)/register')}
            >
                <Radio size={25} color="#a855f7" />
                <Text className="text-primary font-bold text-[15px]">Tap Another Item</Text>
            </AnimatedButton>

        </View>
    )
}